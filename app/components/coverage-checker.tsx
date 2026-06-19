"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, MapPin, CheckCircle, Wifi, AlertCircle, Bell, ArrowRight, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CoverageResult = "high" | "wireless-only" | "no-coverage" | null;

interface CoverageData {
  result: CoverageResult;
  address: string;
  lat: number;
  lng: number;
  suburb?: string;
  postalCode?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoverageChecker() {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coverageResult, setCoverageResult] = useState<CoverageData | null>(null);
  const [waitlistForm, setWaitlistForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ─── Google Maps Autocomplete Setup ──────────────────────────────────────────

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    // Initialize Google Places Autocomplete
    // IMPORTANT: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "za" }, // Restrict to South Africa
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["geocode", "establishment"],
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const address = place.formatted_address || "";
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Extract suburb and postal code from address components
      let suburb = "";
      let postalCode = "";

      place.address_components?.forEach((component) => {
        const types = component.types;
        if (types.includes("sublocality") || types.includes("locality")) {
          suburb = component.long_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      setSearchValue(address);
      setCoverageResult(null); // Reset previous results
    });

    return () => {
      // Cleanup autocomplete listener
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  // ─── Load Google Maps Script ───────────────────────────────────────────────────

  useEffect(() => {
    // Load Google Maps API script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      // IMPORTANT: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // ─── Scroll Animation with Intersection Observer ───────────────────────────────

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ─── Check Coverage Handler ───────────────────────────────────────────────────

  const handleCheckCoverage = async () => {
    if (!searchValue.trim() || !autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert("Please select a valid address from the dropdown.");
      return;
    }

    setIsLoading(true);

    // Extract coordinates and address info
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || "";

    let suburb = "";
    let postalCode = "";

    place.address_components?.forEach((component) => {
      const types = component.types;
      if (types.includes("sublocality") || types.includes("locality")) {
        suburb = component.long_name;
      }
      if (types.includes("postal_code")) {
        postalCode = component.long_name;
      }
    });

    try {
      // Call backend API to check coverage
      const response = await fetch("/api/check-coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, address, suburb, postalCode }),
      });

      const data = await response.json();

      setCoverageResult({
        result: data.result,
        address,
        lat,
        lng,
        suburb,
        postalCode,
      });
    } catch (error) {
      console.error("Error checking coverage:", error);
      // For demo purposes, randomly select a result
      // Remove this in production and use actual API response
      const results: CoverageResult[] = ["high", "wireless-only", "no-coverage"];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      
      setCoverageResult({
        result: randomResult,
        address,
        lat,
        lng,
        suburb,
        postalCode,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Waitlist Form Handler ─────────────────────────────────────────────────────

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWaitlist(true);

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...waitlistForm,
          address: coverageResult?.address,
        }),
      });

      setWaitlistSuccess(true);
    } catch (error) {
      console.error("Error submitting waitlist:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  // ─── Reset Handler ───────────────────────────────────────────────────────────

  const handleReset = () => {
    setSearchValue("");
    setCoverageResult(null);
    setWaitlistForm({ name: "", email: "", phone: "" });
    setWaitlistSuccess(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div 
      ref={wrapperRef}
      className={`coverage-checker-wrapper ${isVisible ? 'visible' : ''}`}
    >
      <style>{`
        /* ─── Coverage Checker Styles ─── */
        .coverage-checker-wrapper {
          position: relative;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity, transform;
        }

        .coverage-checker-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .coverage-search-container {
          position: relative;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .coverage-search-input {
          flex: 1;
          height: 56px;
          padding: 0 20px 0 52px;
          font-size: 1rem;
          font-weight: 500;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
        }

        .coverage-search-input::placeholder {
          color: #7a7a72;
        }

        .coverage-search-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #ff7e26;
          box-shadow: 0 0 0 4px rgba(255, 126, 38, 0.1);
        }

        .coverage-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #7a7a72;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .coverage-search-input:focus + .coverage-search-icon {
          color: #ff7e26;
        }

        .coverage-check-btn {
          height: 56px;
          padding: 0 28px;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #ff7e26 0%, #ff6a00 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          white-space: nowrap;
        }

        .coverage-check-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 126, 38, 0.4);
        }

        .coverage-check-btn:active {
          transform: translateY(0);
        }

        .coverage-check-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* ─── Loading State ─── */
        .coverage-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .coverage-loading-spinner {
          width: 48px;
          height: 48px;
          margin-bottom: 1.5rem;
          color: #ff7e26;
        }

        .coverage-loading-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .coverage-loading-subtext {
          font-size: 0.9rem;
          color: #7a7a72;
        }

        /* ─── Result Cards ─── */
        .coverage-result-card {
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .coverage-result-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .coverage-result-icon {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .coverage-result-icon.high {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .coverage-result-icon.wireless-only {
          background: rgba(255, 126, 38, 0.15);
          color: #ff7e26;
        }

        .coverage-result-icon.no-coverage {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .coverage-result-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .coverage-result-address {
          font-size: 0.9rem;
          color: #7a7a72;
          margin: 0;
        }

        .coverage-result-description {
          font-size: 1rem;
          color: #e8e4de;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .coverage-result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .coverage-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #ff7e26 0%, #ff6a00 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .coverage-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 126, 38, 0.4);
        }

        .coverage-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .coverage-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .coverage-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #7a7a72;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .coverage-reset-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* ─── Waitlist Form ─── */
        .coverage-waitlist-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .coverage-form-input {
          height: 48px;
          padding: 0 16px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease;
        }

        .coverage-form-input::placeholder {
          color: #7a7a72;
        }

        .coverage-form-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #ff7e26;
        }

        .coverage-form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .coverage-waitlist-success {
          padding: 1.5rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          text-align: center;
        }

        .coverage-waitlist-success p {
          font-size: 1rem;
          font-weight: 600;
          color: #22c55e;
          margin: 0;
        }

        /* ─── Responsive ─── */
        @media (max-width: 640px) {
          .coverage-search-container {
            flex-direction: column;
          }

          .coverage-search-input,
          .coverage-check-btn {
            width: 100%;
          }

          .coverage-search-input {
            padding-left: 48px;
          }

          .coverage-result-card {
            padding: 1.5rem;
          }

          .coverage-result-title {
            font-size: 1.25rem;
          }

          .coverage-result-actions {
            flex-direction: column;
          }

          .coverage-btn-primary,
          .coverage-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* ─── Search Input ─── */}
      {!coverageResult && !isLoading && (
        <div className="coverage-search-container">
          <div style={{ position: "relative", flex: 1 }}>
            <input
              ref={inputRef}
              type="text"
              className="coverage-search-input"
              placeholder="Enter your address (e.g., 123 Main Street, Riebeek Valley)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <MapPin className="coverage-search-icon" size={20} />
          </div>
          <button
            className="coverage-check-btn"
            onClick={handleCheckCoverage}
            disabled={!searchValue.trim()}
          >
            Check Availability
          </button>
        </div>
      )}

      {/* ─── Loading State ─── */}
      {isLoading && (
        <div className="coverage-loading">
          <Loader2 className="coverage-loading-spinner" size={48} />
          <p className="coverage-loading-text">Checking coverage...</p>
          <p className="coverage-loading-subtext">Verifying availability at your location</p>
        </div>
      )}

      {/* ─── Result: High Coverage ─── */}
      {coverageResult?.result === "high" && (
        <div className="coverage-result-card">
          <div className="coverage-result-header">
            <div className="coverage-result-icon high">
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="coverage-result-title">Great news! High-speed services available</h3>
              <p className="coverage-result-address">{coverageResult.address}</p>
            </div>
          </div>
          <p className="coverage-result-description">
            Both Wireless and Fibre internet are available at your location. Get connected today with our fastest speeds.
          </p>
          <div className="coverage-result-actions">
            <button className="coverage-btn-primary">
              View Packages & Order
              <ArrowRight size={18} />
            </button>
            <button className="coverage-reset-btn" onClick={handleReset}>
              <X size={16} />
              Check another address
            </button>
          </div>
        </div>
      )}

      {/* ─── Result: Wireless Only ─── */}
      {coverageResult?.result === "wireless-only" && (
        <div className="coverage-result-card">
          <div className="coverage-result-header">
            <div className="coverage-result-icon wireless-only">
              <Wifi size={28} />
            </div>
            <div>
              <h3 className="coverage-result-title">Good news! Wireless available</h3>
              <p className="coverage-result-address">{coverageResult.address}</p>
            </div>
          </div>
          <p className="coverage-result-description">
            High-speed Wireless internet is available at your location. Fibre is coming soon to your area.
          </p>
          <div className="coverage-result-actions">
            <button className="coverage-btn-primary">
              View Wireless Packages
              <ArrowRight size={18} />
            </button>
            <button className="coverage-btn-secondary">
              <Bell size={18} />
              Notify me when Fibre arrives
            </button>
            <button className="coverage-reset-btn" onClick={handleReset}>
              <X size={16} />
              Check another address
            </button>
          </div>
        </div>
      )}

      {/* ─── Result: No Coverage ─── */}
      {coverageResult?.result === "no-coverage" && (
        <div className="coverage-result-card">
          <div className="coverage-result-header">
            <div className="coverage-result-icon no-coverage">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="coverage-result-title">Not covered yet, but we're expanding!</h3>
              <p className="coverage-result-address">{coverageResult.address}</p>
            </div>
          </div>
          <p className="coverage-result-description">
            We don't cover your area just yet, but we're expanding rapidly. Join our waitlist and we'll notify you when service becomes available.
          </p>

          {!waitlistSuccess ? (
            <form className="coverage-waitlist-form" onSubmit={handleWaitlistSubmit}>
              <input
                type="text"
                className="coverage-form-input"
                placeholder="Your name"
                value={waitlistForm.name}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                required
                disabled={isSubmittingWaitlist}
              />
              <input
                type="email"
                className="coverage-form-input"
                placeholder="Email address"
                value={waitlistForm.email}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                required
                disabled={isSubmittingWaitlist}
              />
              <input
                type="tel"
                className="coverage-form-input"
                placeholder="Phone number"
                value={waitlistForm.phone}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                disabled={isSubmittingWaitlist}
              />
              <button
                type="submit"
                className="coverage-btn-primary"
                disabled={isSubmittingWaitlist}
                style={{ justifyContent: "center" }}
              >
                {isSubmittingWaitlist ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Bell size={18} />
                    Join the Waitlist
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="coverage-waitlist-success">
              <p>✓ You're on the waitlist! We'll notify you when service is available.</p>
            </div>
          )}

          <button className="coverage-reset-btn" onClick={handleReset} style={{ marginTop: "1rem" }}>
            <X size={16} />
            Check another address
          </button>
        </div>
      )}
    </div>
  );
}
