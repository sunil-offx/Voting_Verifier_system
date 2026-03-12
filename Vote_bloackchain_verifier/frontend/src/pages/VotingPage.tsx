import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_BASE_URL, Candidate } from "@/lib/api";

const VotingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stateData = location.state as {
        stateName: string;
        district: string;
        constituency: string;
        stationNumber: number;
        stationName: string;
        stationLocation: string;
    };

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        // If no context, redirect to home
        if (!stateData) {
            navigate("/");
            return;
        }

        // Fetch Candidates from backend
        const fetchCandidates = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/candidates`);
                if (!response.ok) throw new Error("Failed to fetch candidates");
                const data = await response.json();
                setCandidates(data);
            } catch (err) {
                toast.error("Error loading candidates from blockchain.");
                console.error(err);
            }
        };

        fetchCandidates();
    }, [stateData, navigate]);

    const handleVote = async () => {
        if (selectedCandidate === null) {
            toast.error("Please select a candidate before casting your vote");
            return;
        }

        const token = sessionStorage.getItem("access_token");
        if (!token) {
            toast.error("You are not authenticated. Please log in first.");
            navigate("/");
            return;
        }

        setIsVoting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ candidate_id: selectedCandidate })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Error casting vote");
            }

            toast.success(data.message || "Vote successfully cast on blockchain!");

            // Clear token and navigate to success
            setTimeout(() => {
                sessionStorage.removeItem("access_token");
                navigate("/"); // back to login
            }, 3000);

        } catch (err: any) {
            toast.error(err.message || "An error occurred while voting.");
        } finally {
            setIsVoting(false);
        }
    };

    if (!stateData) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b-4 border-primary bg-primary">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground text-center tracking-tight">
                        Secure Voting Portal
                    </h1>
                    <p className="font-heading text-base sm:text-lg text-primary-foreground/90 text-center mt-1 font-medium">
                        {stateData.stationName} ({stateData.constituency})
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
                <h2 className="font-heading text-xl font-semibold mb-6">Select a candidate:</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidates.length === 0 ? (
                        <p>Loading candidates...</p>
                    ) : (
                        candidates.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => setSelectedCandidate(c.id)}
                                className={`border p-6 rounded-lg cursor-pointer transition-colors \${selectedCandidate === c.id ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold font-heading">{c.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Candidate ID: {c.id}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center \${selectedCandidate === c.id ? 'border-primary' : 'border-muted-foreground'}`}>
                                        {selectedCandidate === c.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-10 flex justify-end">
                    <Button
                        disabled={selectedCandidate === null || isVoting}
                        onClick={handleVote}
                        className="px-8 py-6 text-lg font-heading"
                    >
                        {isVoting ? "Broadcasting to Blockchain..." : "Cast Secure Vote"}
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default VotingPage;
