"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AskPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);

    const [userId, setUserId] = useState("");
    const [patientId, setPatientId] = useState("");
    const [question, setQuestion] = useState("");

    const [answer, setAnswer] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
        loadPatients();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadPatients = async () => {
        try {
            const res = await api.get("/patients");
            setPatients(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const askQuestion = async () => {
        if (!userId || !patientId || !question) {
            alert("Please select doctor, patient and enter a question");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/ask", {
                userId,
                patientId,
                question,
            });

            setAnswer(res.data);
        } catch (err) {
            console.error(err);
            alert("Error asking question");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold text-white">
                        BRAHMO AI Assistant
                    </h1>

                    <p className="text-slate-300 mt-3 text-lg">
                        Organizational Healthcare Knowledge System
                    </p>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Panel */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6">

                        <h2 className="text-2xl font-bold text-white mb-6">
                            Clinical Query
                        </h2>

                        <div className="space-y-4">

                            <select
                                className="w-full
bg-slate-900
border
border-slate-600
text-white
rounded-xl
p-4
focus:outline-none
focus:ring-2
focus:ring-cyan-500"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            >
                                <option value="">
                                    Select Doctor
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="w-full
bg-slate-900
border
border-slate-600
text-white
rounded-xl
p-4
focus:outline-none
focus:ring-2
focus:ring-cyan-500"
                                value={patientId}
                                onChange={(e) =>
                                    setPatientId(e.target.value)
                                }
                            >
                                <option value="">
                                    Select Patient
                                </option>

                                {patients.map((patient) => (
                                    <option
                                        key={patient.id}
                                        value={patient.id}
                                    >
                                        {patient.name}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                className="w-full
bg-slate-900
border
border-slate-600
text-white
rounded-xl
p-4
focus:outline-none
focus:ring-2
focus:ring-cyan-500"
                                rows={6}
                                value={question}
                                onChange={(e) =>
                                    setQuestion(e.target.value)
                                }
                                placeholder="Ask a clinical question..."
                            />

                            <button
                                onClick={askQuestion}
                                disabled={loading}
                                className="w-full
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:from-cyan-400
hover:to-blue-500
text-white
font-bold
py-4
rounded-xl
shadow-lg
transition-all
duration-300"
                            >
                                {loading
                                    ? "🤖 Thinking..."
                                    : "Ask AI"}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6">

                        <h2 className="text-2xl font-bold text-white mb-6">
                            AI Recommendation
                        </h2>

                        {!answer && (
                            <div className="text-gray-500">
                                Select a doctor, patient and ask a
                                question to receive AI guidance.
                            </div>
                        )}

                        {answer && (
                            <>
                                <div className="bg-slate-900
border
border-slate-700
rounded-xl
p-5
text-slate-200">
                                    <pre className="whitespace-pre-wrap text-sm leading-7">
                                        {answer.answer}
                                    </pre>
                                </div>
 
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold text-white mb-6">
                                        Knowledge Statistics
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-600">
                                                Total Nodes
                                            </p>    

                                            <p className="text-2xl font-bold text-blue-700">
                                                {answer.stats.totalNodes}
                                            </p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-600">
                                                Hospital
                                            </p>

                                            <p className="text-2xl font-bold text-green-700">
                                                {answer.stats.hospitalNodes}
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-600">
                                                Department
                                            </p>

                                            <p className="text-2xl font-bold text-yellow-700">
                                                {answer.stats.departmentNodes}
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-600">
                                                Patient
                                            </p>

                                            <p className="text-2xl font-bold text-purple-700">
                                                {answer.stats.patientNodes}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}