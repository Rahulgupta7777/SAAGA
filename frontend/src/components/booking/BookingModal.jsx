import { useState, useEffect, useCallback } from "react";
import api from "../../../utils/api.js";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useNavigate } from "react-router-dom";

const BookingModal = ({
  isOpen,
  onClose,
  selectedServices,
  selectedProducts,
  isForceLogin,
}) => {
  const { login, user, fetchActiveBooking } = useBooking();
  const navigate = useNavigate();

  // Steps:
  // 0: Cart Summary
  // 1: Date/Time
  // 2: Login (Phone)
  // 3: Verify OTP
  // 4: Confirm
  // 5: Empty Cart Suggestion
  const [step, setStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Auth State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const determineInitialStep = useCallback(() => {
    if (selectedServices?.length > 0 || selectedProducts?.length > 0) {
      setStep(0); // Go to Cart Summary
    } else {
      setStep(5); // Go to Suggestion
    }
  }, [selectedServices, selectedProducts]);


  useEffect(() => {
    if (isOpen) {
      if (isForceLogin && !user) {
        setStep(2);
      } else {
        determineInitialStep();
      }
      if (!isForceLogin) {
        setSelectedDate(null);
        setSelectedTime(null);
      }
      setPhone(user?.phone || "");
      setName(user?.name || "");
      setCoupon("");
      setDiscount(0);
    }
  }, [isOpen]);


  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) {
        setAvailableSlots([]); // Clear slots if conditions aren't met
        return;
      }
      setIsLoading(true);
      try {
        // Format Date: YYYY-MM-DD
        const dateStr = selectedDate.toLocaleDateString("en-CA");

        const serviceIds =
          selectedServices.length > 0 ? selectedServices.map((s) => s._id || s.id).join(",") : "";
        // console.log(`Fetching slots for: ${dateStr}, Services: ${serviceIds}`);

        const res = await api.public.getSlots(dateStr, serviceIds);
        if (res.data && Array.isArray(res.data.slots)) {
          setAvailableSlots(res.data.slots);
        } else {
          console.warn("Invalid slot response:", res.data);
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching slots", error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (step === 1) fetchSlots();
  }, [selectedDate, selectedServices, step]);

  if (!isOpen) return null;

  // Calendar Logic
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i,
      );
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected =
        selectedDate && selectedDate.toDateString() === date.toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => setSelectedDate(date)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isSelected ? "bg-brown-900 text-white" : ""}
                        ${!isSelected && !isPast ? "hover:bg-brown-100 text-brown-900" : ""}
                        ${isToday && !isSelected ? "border border-brown-900 text-brown-900" : ""}
                        ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                    `}
        >
          {i}
        </button>,
      );
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    const now = new Date();
    const prev = new Date( currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if ( prev.getMonth() >= now.getMonth() || prev.getFullYear() > now.getFullYear()) {
      setCurrentMonth(prev);
    }
  };

  //CART & TOTALS 
  const calculateTotal = () => {
    const servicesTotal = selectedServices?.reduce((acc, s) => acc + (parseInt(s.price) || 0), 0) || 0;
    const productsTotal = selectedProducts?.reduce((acc, p) => acc + (parseInt(p.price) || 0), 0) || 0;
    return servicesTotal + productsTotal;
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.public.verifyCoupon(coupon);
      const offer = res.data;

      const currentTotal = calculateTotal();
      let disc = 0;

      if (offer.type === "percentage") {
        disc = (currentTotal * offer.value) / 100;
      } else {
        disc = offer.value;
      }

      setDiscount(Math.min(disc, currentTotal)); 
      alert(`Coupon "${offer.code}" Applied! You saved ₹${Math.min(disc, currentTotal)}`);
      
    } catch (error) {
      setDiscount(0);
      const msg = error.response?.data?.message || "Invalid Coupon";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  //API Handlers
  const handleSendOtp = async () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!phone || phone.length < 10)
      return alert("Please enter a valid phone number");
    setIsLoading(true);
    try {
      await api.auth.sendOtp(phone);
      setStep(3); // Go to OTP
    } catch {
      alert("Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    setIsLoading(true);
    try {
      const res = await api.auth.verifyOtp(phone, otp, name);
      const userData = { ...res.data.user, token: res.data.token };
      login(userData);

      try {
        const bookingRes = await api.bookings.getMyBookings();
        const bookings = Array.isArray(bookingRes.data) ? bookingRes.data : [];
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const hasActive = bookings.find((b) => {
          const bookingDate = new Date(b.date);
          const isActiveStatus = b.status !== "cancelled" && b.status !== "completed";
          const isFuture = bookingDate >= now;
          return isActiveStatus && isFuture;
        });

        if (hasActive) {
           alert("You already have an upcoming visit scheduled. Redirecting to your schedule...");
           fetchActiveBooking(); 
           onClose();
           navigate("/schedule");
           return; 
        }
      } catch (err) {
        console.error("Booking check failed", err);
      }

      if (selectedDate && selectedTime) {
        // Edge Case: User picked date -> Session Expired -> Re-login
        setStep(4); // Go to Confirm
      } else {
        // Check Cart State
        if (
          (selectedServices && selectedServices.length > 0) ||
          (selectedProducts && selectedProducts.length > 0)
        ) {
          setStep(0); // Go to Cart Summary
        } else {
          setStep(5); // Go to Suggestion
        }
      }
      // setStep(4); // Go to Confirm
    } catch(error) {
      console.error(error);
      alert("Invalid OTP or Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const servicesPayload =
        selectedServices.length > 0
          ? selectedServices.map((s) => ({
              serviceId: s._id || s.id,
              variant: "female", // Defaulting to female for now
            }))
          : [];
      await api.bookings.create({
        userId: user._id,
        date: selectedDate.toISOString(),
        timeSlot: selectedTime,
        services: servicesPayload,
        products: [],
        staffId: null,
        couponCode: coupon,
      });

      alert("Booking Confirmed Successfully!");
      fetchActiveBooking();
      onClose();
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brown-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-cream px-6 py-4 flex justify-between items-center border-b border-brown-900/5">
          <h2 className="font-serif text-2xl text-brown-900">
            {step === 0 ? "Review Order" :
             step === 1 ? "Select Date" :
             step === 2 ? "Login" :
             step === 3 ? "Verify OTP" :
             step === 4 ? "Confirm Booking" :
             step === 5 ? "Start Booking" : ""}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brown-900/5 rounded-full text-brown-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* STEP 0: CART SUMMARY */}
          {step === 0 && (
             <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-brown-900 uppercase tracking-wider">Services</h3>
                    {selectedServices?.length > 0 ? selectedServices.map((s, i) => (
                        <div key={`s-${i}`} className="flex justify-between text-brown-800 border-b border-dashed border-brown-100 pb-2">
                            <span>{s.name}</span>
                            <span>₹{s.price}</span>
                        </div>
                    )) : <p className="text-gray-400 text-sm italic">No services selected</p>}

                    {selectedProducts?.length > 0 && (
                        <>
                            <h3 className="text-xs font-bold text-brown-900 uppercase tracking-wider mt-4">Products</h3>
                            {selectedProducts.map((p, i) => (
                                <div key={`p-${i}`} className="flex justify-between text-brown-800 border-b border-dashed border-brown-100 pb-2">
                                    <span>{p.name}</span>
                                    <span>₹{p.price}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div className="flex gap-2">
                        <input 
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Promo Code"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        />
                        <button onClick={handleApplyCoupon} className="bg-brown-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            Apply
                        </button>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-₹{discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-brown-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{calculateTotal() - discount}</span>
                    </div>
                </div>

                <button 
                    onClick={() => setStep(1)}
                    className="w-full py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 transition-all"
                >
                    Proceed to Date & Time
                </button>
             </div>
          )}


          {/* STEP 5: SUGGESTION (Empty Cart) */}
          {step === 5 && (
             <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-brown-50 rounded-full flex items-center justify-center mx-auto text-brown-900">
                    <AlertCircle size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-serif text-brown-900 mb-2">No Services Selected</h3>
                    <p className="text-brown-600 text-sm max-w-xs mx-auto">
                        We recommend adding services to your cart for accurate duration planning.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => { onClose(); navigate("/services"); }}
                        className="w-full py-3 bg-brown-900 text-white rounded-full font-medium shadow-lg hover:bg-brown-800"
                    >
                        Browse Services
                    </button>
                    <button 
                        onClick={() => setStep(1)}
                        className="w-full py-3 text-brown-600 hover:text-brown-900 font-medium text-sm"
                    >
                        Proceed without services
                    </button>
                </div>
             </div>
          )}


          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-sm font-bold text-brown-900 uppercase tracking-wider flex items-center gap-2">
                    <CalendarIcon size={16} /> Select Date
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={18} /></button>
                    <span className="text-sm font-medium w-24 text-center">
                      {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={18} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="text-xs font-medium text-gray-400 w-10 text-center">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center">
                  {generateCalendar()}
                </div>
              </div>
              
              {/* Time Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.length > 0 ? availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${selectedTime === time ? "bg-brown-900 text-white" : ""}`}
                    >
                      {time}
                    </button>
                )) : <p className="col-span-4 text-center text-sm text-gray-400">No slots available (Select a service or check date)</p>}
              </div>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                   if (user) setStep(4);
                   else setStep(2); // sending user to login if session lost
                }}
                className="w-full px-6 py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: LOGIN */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-brown-900 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none mb-4" value={name} onChange={(e) => setName(e.target.value)} />
                <label className="block text-xs font-bold text-brown-900 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 font-serif">+91</span>
                  <input type="tel" placeholder="98765 43210" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <button onClick={handleSendOtp} disabled={isLoading} className="w-full py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 transition-all shadow-lg">
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <p className="text-brown-600">
                Enter the OTP sent to +91 {phone}
              </p>
              <input
                type="text"
                placeholder="••••"
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none transition-colors text-center text-2xl tracking-[0.5em] font-serif"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 transition-all shadow-lg"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-brown-500 underline"
              >
                Change Number
              </button>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-cream p-4 rounded-xl border border-brown-900/10">
                <span className="text-md font-serif text-brown-900 block mb-2">
                  {selectedDate?.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })} at {selectedTime}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedServices?.map((s) => (
                    <span key={s.name} className="px-2 py-1 bg-white rounded-md text-xs text-brown-800 border border-brown-900/5">{s.name}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-brown-900/10 flex justify-between font-bold text-brown-900">
                    <span>Total Amount</span>
                    <span>₹{Math.max(0, calculateTotal() - discount)}</span>
                </div>
              </div>
              <button onClick={handleConfirmBooking} disabled={isLoading} className="w-full py-3 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 disabled:opacity-50 transition-all shadow-lg">
                {isLoading ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};;

export default BookingModal;
