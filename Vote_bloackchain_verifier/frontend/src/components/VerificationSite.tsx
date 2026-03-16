import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Fingerprint, QrCode, ArrowLeft } from "lucide-react";

interface VerificationSiteProps {
  voterId: string;
  voterName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const VerificationSite = ({ voterId, voterName, onSuccess, onCancel }: VerificationSiteProps) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (step === 1) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        async (decodedText) => {
          scanner.clear();
          handleQRScanned(decodedText);
        },
        (error) => {
          // ignore scan errors
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [step]);

  const handleQRScanned = async (content: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_content: content, voter_id: voterId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "QR Verification Failed");
      }

      toast.success("QR Code Verified Successfully");
      setStep(2);
    } catch (error: any) {
      toast.error(error.message);
      setStep(1); // Reset scanner if failed
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBiometric = async () => {
    setIsProcessing(true);
    try {
      // Step 2: Simulate physical biometric input
      // In a real hackathon mobile demo, you'd use WebAuthn or a custom bridge.
      // Here we simulate the extraction and step 3 (Server check).
      
      const dummyFingerprintHash = `FP_${voterId}_HACKATHON_DEMO`; 

      const response = await fetch(`${API_BASE_URL}/verify-biometric`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            voter_id: voterId, 
            fingerprint_data: dummyFingerprintHash 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Verification Failed");
      }

      toast.success("Biometric Verified! Identity Confirmed.");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-heading">Digital Identity Verification</h2>
            <p className="text-sm opacity-90">Verifying: {voterName} ({voterId})</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-primary-foreground hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex flex-col items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? "border-primary bg-primary/10" : "border-muted"}`}>1</div>
              <span className="text-xs font-bold uppercase">QR Scan</span>
            </div>
            <div className={`h-px flex-1 mx-4 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex flex-col items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? "border-primary bg-primary/10" : "border-muted"}`}>2</div>
              <span className="text-xs font-bold uppercase">Biometric</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <QrCode className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-bold font-heading">Step 1: Scan Voter QR</h3>
                <p className="text-sm text-muted-foreground mt-2">Position the voter's secure QR code in front of the camera to extract identity tokens.</p>
              </div>
              <div id="reader" className="overflow-hidden rounded-lg border border-border bg-black/5 min-h-[300px]" />
              {isProcessing && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm font-medium">Extracting content & checking database...</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <Fingerprint className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-bold font-heading">Step 2: Biometric Input</h3>
                <p className="text-sm text-muted-foreground mt-2">Capture the voter's fingerprint scan. System will auto-compare with existing records for double-voting prevention.</p>
              </div>
              
              <div className="p-12 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping absolute inset-0" />
                    <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center relative">
                        <Fingerprint className="h-10 w-10 text-primary" />
                    </div>
                </div>
                
                <Button 
                    className="w-full py-6 text-lg font-heading" 
                    onClick={handleBiometric}
                    disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Comparing Fingerprints...
                    </>
                  ) : "Initialize Fingerprint Scan"}
                </Button>
              </div>
              
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                Step 3: Automated backend comparison will finalize eligibility
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationSite;
