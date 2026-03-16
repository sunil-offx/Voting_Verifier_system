import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import VerificationSite from "@/components/VerificationSite";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export interface VoterRecord {
    voterName: string;
    voterId: string;
    fatherName: string;
    verified: boolean;
}

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
    } | null;

    const [voters, setVoters] = useState<VoterRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeVerification, setActiveVerification] = useState<VoterRecord | null>(null);

    // If no context, redirect to home
    useEffect(() => {
        if (!stateData) {
            navigate("/");
        }
    }, [stateData, navigate]);

    const fetchVotersFromBackend = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/electors`);
            if (response.ok) {
                const backendElectors = await response.json();
                return backendElectors;
            }
        } catch (e) {
            console.error("Failed to fetch electors from backend", e);
        }
        return null;
    };

    const loadDataset = async () => {
        if (!stateData) return;
        setIsLoading(true);
        const fileName = `dataset_${stateData.constituency.replace(/\s+/g, '_')}_${stateData.stationNumber}.csv`;
        
        try {
            // 1. Load CSV
            const response = await fetch(`/${fileName}`);
            if (!response.ok) throw new Error("Dataset not found");
            const text = await response.text();

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
            if (lines.length < 2) throw new Error("CSV empty");

            const csvVoters: any[] = [];
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split(",").map(col => col.trim().replace(/^"|"$/g, ''));
                if (columns.length >= 3) {
                    csvVoters.push({
                        voter_name: columns[0],
                        voter_id: columns[1],
                        father_name: columns[2]
                    });
                }
            }

            // 2. Sync with Backend
            await fetch(`${API_BASE_URL}/sync-electors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(csvVoters)
            });

            // 3. Get latest status from Backend
            const backendData = await fetchVotersFromBackend();
            if (backendData) {
                const merged = csvVoters.map(v => {
                    const status = backendData.find((b: any) => b.voter_id === v.voter_id);
                    return {
                        voterName: v.voter_name,
                        voterId: v.voter_id,
                        fatherName: v.father_name,
                        verified: status ? status.is_verified : false
                    };
                });
                setVoters(merged);
            }

            toast.success(`Active Dataset: ${fileName}`);
        } catch (err) {
            console.error(err);
            toast.error("Error loading/syncing dataset.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDataset();
    }, [stateData]);

    const handleVerificationSuccess = () => {
        if (activeVerification) {
            setVoters(prev => prev.map(v => 
                v.voterId === activeVerification.voterId ? { ...v, verified: true } : v
            ));
        }
        setActiveVerification(null);
    };

    if (!stateData) return null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b-4 border-primary bg-primary">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground text-center tracking-tight">
                        Voter Verification Desk
                    </h1>
                    <p className="font-heading text-base sm:text-lg text-primary-foreground/90 text-center mt-1 font-medium">
                        {stateData.stationName} ({stateData.constituency})
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
                <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm" onClick={loadDataset} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Sync Records
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-card">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h2 className="font-heading text-xl font-semibold mb-2">Syncing with Backend...</h2>
                        <p className="font-body text-muted-foreground text-center max-w-md">
                            Initializing distributed database records for verification...
                        </p>
                    </div>
                ) : voters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-card text-center">
                        <h2 className="font-heading text-xl text-destructive font-semibold mb-2">Dataset Not Found</h2>
                        <p className="font-body text-muted-foreground max-w-md">
                            Please drop your <strong>{`dataset_${stateData.constituency.replace(/\s+/g, '_')}_${stateData.stationNumber}.csv`}</strong> file directly into the:
                            <br /><br />
                            <code className="bg-muted px-3 py-2 rounded text-base border-border border">frontend/public/</code>
                            <br /><br /> folder and click Sync Records.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border mt-4 shadow-sm rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="font-heading text-lg font-bold">Registered Voters Database</h2>
                            <span className="text-sm text-primary font-bold font-heading px-3 py-1 bg-primary/10 rounded-full">
                                {voters.length} Records Loaded
                            </span>
                        </div>

                        <div className="max-h-[600px] overflow-auto p-0 scrollbar-thin">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="font-heading font-bold sticky top-0 bg-muted border-b z-10">Voter Name</TableHead>
                                        <TableHead className="font-heading font-bold sticky top-0 bg-muted border-b z-10">Voter ID (EPIC)</TableHead>
                                        <TableHead className="font-heading font-bold sticky top-0 bg-muted border-b z-10">Father's Name</TableHead>
                                        <TableHead className="font-heading font-bold text-center w-32 sticky top-0 bg-muted border-b z-10">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {voters.map((voter, idx) => (
                                        <TableRow key={idx} className={`transition-colors duration-200 ${voter.verified ? "bg-green-500/10 hover:bg-green-500/15" : ""}`}>
                                            <TableCell className="font-body font-semibold text-base py-4">{voter.voterName}</TableCell>
                                            <TableCell className="font-body font-medium text-muted-foreground py-4">{voter.voterId}</TableCell>
                                            <TableCell className="font-body text-muted-foreground py-4">{voter.fatherName}</TableCell>
                                            <TableCell className="text-center py-4">
                                                {voter.verified ? (
                                                    <div className="flex flex-col items-center justify-center text-green-600 gap-1 select-none">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setActiveVerification(voter)}
                                                        className="w-full font-heading font-bold hover:scale-105 transition-transform"
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground font-body">
                                {voters.filter(v => v.verified).length} / {voters.length} Verified
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Verification Modal/Overlay */}
            {activeVerification && (
                <VerificationSite 
                    voterId={activeVerification.voterId}
                    voterName={activeVerification.voterName}
                    onSuccess={handleVerificationSuccess}
                    onCancel={() => setActiveVerification(null)}
                />
            )}
        </div>
    );
};

export default VotingPage;
