import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
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

    // If no context, redirect to home
    useEffect(() => {
        if (!stateData) {
            navigate("/");
        }
    }, [stateData, navigate]);

    useEffect(() => {
        if (!stateData) return;

        const loadDataset = async () => {
            const fileName = `dataset_${stateData.constituency.replace(/\s+/g, '_')}_${stateData.stationNumber}.csv`;
            try {
                // Automatically fetch the CSV file statically from the public folder
                const response = await fetch(`/${fileName}`);

                if (!response.ok) {
                    throw new Error("Dataset not found");
                }

                const text = await response.text();

                // Basic CSV Parser
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
                if (lines.length < 2) { // Need at least header + 1 row
                    toast.error("CSV file seems empty or contains only headers");
                    setIsLoading(false);
                    return;
                }

                // Assume first row is header, process subsequent rows
                const parsedVoters: VoterRecord[] = [];

                // Skip header (i=0)
                for (let i = 1; i < lines.length; i++) {
                    const columns = lines[i].split(",").map(col => col.trim().replace(/^"|"$/g, ''));
                    if (columns.length >= 3) {
                        parsedVoters.push({
                            voterName: columns[0] || "-",
                            voterId: columns[1] || "-",
                            fatherName: columns[2] || "-",
                            verified: false
                        });
                    }
                }

                setVoters(parsedVoters);
                toast.success(`Automatically loaded ${parsedVoters.length} voters from ${fileName}`);
            } catch (err) {
                toast.error(`Could not load '${fileName}' from the public folder. Please upload it inside frontend/public/ !!`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDataset();
    }, [stateData]);

    const handleVerify = (index: number) => {
        const newVoters = [...voters];
        newVoters[index].verified = true;
        setVoters(newVoters);
        toast.success(`Identity Confirmed: ${newVoters[index].voterName} has been verified.`);
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

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-card">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h2 className="font-heading text-xl font-semibold mb-2">Loading Dataset...</h2>
                        <p className="font-body text-muted-foreground text-center max-w-md">
                            Automatically reading dataset.csv from your project folder...
                        </p>
                    </div>
                ) : voters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-card text-center">
                        <h2 className="font-heading text-xl text-destructive font-semibold mb-2">Dataset Not Found</h2>
                        <p className="font-body text-muted-foreground max-w-md">
                            Please drop your <strong>{`dataset_${stateData.constituency.replace(/\s+/g, '_')}_${stateData.stationNumber}.csv`}</strong> file directly into the:
                            <br /><br />
                            <code className="bg-muted px-3 py-2 rounded text-base border-border border">Voting_Verifier_system/frontend/public/</code>
                            <br /><br /> folder and click Retry below.
                        </p>
                        <Button
                            className="mt-6 font-heading"
                            onClick={() => window.location.reload()}
                        >
                            Retry Loading
                        </Button>
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
                                                        onClick={() => handleVerify(idx)}
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
        </div>
    );
};

export default VotingPage;
