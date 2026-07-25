"use client";

import { useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, Send, Bot, Loader2, Package, HelpCircle, AlertTriangle, GripHorizontal } from "lucide-react";

export default function AIChatBubble() {
    const dragControls = useDragControls(); // 💡 Drag Controls Ref

    const [isOpen, setIsOpen] = useState(false);
    const [intent, setIntent] = useState<"ORDER_QUERY" | "PRODUCT_QUERY" | "COMPLAINT" | null>(null);

    // Input States
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [orderId, setOrderId] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const [chatLog, setChatLog] = useState<{ role: "bot" | "user"; text: string }[]>([
        { role: "bot", text: "Hello! Welcome to MEILI AI Support. How can I help you today?" },
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!intent) return;

        let userMsg = message.trim();
        let displayUserMessage = userMsg;

        // 🔒 ORDER_QUERY Input Validation Check (No Browser Alert!)
        if (intent === "ORDER_QUERY") {
            if (!orderId.trim() || !firstName.trim() || !lastName.trim()) {
                // Inline bot response for missing details
                setChatLog((prev) => [
                    ...prev,
                    {
                        role: "bot",
                        text: "⚠️ Security Verification Required: Please enter your Order ID, First Name, and Last Name below before proceeding.",
                    },
                ]);
                return;
            }
            displayUserMessage = `Checking Order #${orderId.replace("#", "")} for ${firstName} ${lastName}`;
            if (!userMsg) userMsg = displayUserMessage;
        } else {
            if (!userMsg) return;
        }

        // Append User Message to Chat UI
        setChatLog((prev) => [...prev, { role: "user", text: displayUserMessage }]);
        setMessage("");
        setLoading(true);

        // Smart Conversion for Number inputs inside Complaint Mode
        const isOnlyNumber = /^\#?\d+$/.test(userMsg);
        let activeIntent = intent;
        let currentOrderId = orderId;

        if (intent === "COMPLAINT" && isOnlyNumber) {
            activeIntent = "ORDER_QUERY";
            currentOrderId = userMsg;
        }

        try {
            const res = await fetch("https://meili-ai-support-service.onrender.com/api/v1/agent/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    intent: activeIntent,
                    customer_email: email || "customer@smartstyle.com",
                    order_id: currentOrderId,
                    first_name: firstName,
                    last_name: lastName,
                    subject: subject,
                    message: userMsg,
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                if (activeIntent === "ORDER_QUERY") {
                    setChatLog((prev) => [...prev, { role: "bot", text: data.data.message }]);
                    // Success: Reset Intent & Order Inputs
                    setIntent(null);
                    setOrderId("");
                    setFirstName("");
                    setLastName("");
                } else if (activeIntent === "PRODUCT_QUERY") {
                    setChatLog((prev) => [...prev, { role: "bot", text: data.message }]);
                } else if (activeIntent === "COMPLAINT") {
                    setChatLog((prev) => [
                        ...prev,
                        {
                            role: "bot",
                            text: `⚠️ Complaint Registered (#Ticket ${data.ticket_id})\n\nSuggested Fix: ${data.ai_analysis.suggested_reply}`,
                        },
                    ]);
                    setSubject("");
                    setIntent(null);
                }
            } else {
                // Verification failed or Error Message from FastAPI
                setChatLog((prev) => [...prev, { role: "bot", text: data.message || "Something went wrong." }]);
            }
        } catch (err) {
            setChatLog((prev) => [
                ...prev,
                { role: "bot", text: "Unable to connect to AI Support Engine. Ensure Python FastAPI is running!" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Bubble Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl border border-gray-700 cursor-pointer"
                >
                    <Bot className="w-6 h-6 text-emerald-400" />
                    <span className="font-semibold text-sm pr-1">AI Support</span>
                </motion.button>
            )}

            {/* Draggable Chat Modal with Framer Motion */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        drag
                        dragControls={dragControls}
                        dragListener={false} // 💡 Prevents dragging when clicking/highlighting chat content
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-96 h-[540px] flex flex-col overflow-hidden"
                    >
                        {/* Draggable Header Only 🖐️ */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)} // 💡 Only Header triggers drag
                            className="bg-black text-white p-4 flex justify-between items-center select-none cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <h3 className="font-bold text-sm flex items-center gap-1.5">
                                        MEILI AI Assistant
                                        <GripHorizontal className="w-4 h-4 text-gray-400" />
                                    </h3>
                                    <p className="text-[10px] text-gray-400">Online • Powered by Gemini</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-md cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Messages Section - 100% SELECTABLE TEXT 📝 */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm select-text">
                            {chatLog.map((log, index) => (
                                <div
                                    key={index}
                                    className={`flex ${log.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line text-xs sm:text-sm select-text cursor-text ${
                                            log.role === "user"
                                                ? "bg-black text-white rounded-br-none"
                                                : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                                        }`}
                                    >
                                        {log.text}
                                    </div>
                                </div>
                            ))}

                            {/* ⚡ ENHANCED LOADING UI */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 text-xs text-gray-600 max-w-[85%] animate-pulse">
                                        <Loader2 className="w-4 h-4 animate-spin text-black shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">AI Support processing request...</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                                                First message may take ~20s if server is waking up.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Options Menu */}
                        {!intent ? (
                            <div className="p-3 bg-white border-t border-gray-100 space-y-2">
                                <p className="text-[11px] font-semibold text-gray-500 mb-1">Select an Option:</p>
                                <button
                                    onClick={() => setIntent("ORDER_QUERY")}
                                    className="w-full flex items-center gap-2 text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 border transition cursor-pointer"
                                >
                                    <Package className="w-4 h-4 text-blue-500" /> Check Order Details
                                </button>
                                <button
                                    onClick={() => setIntent("PRODUCT_QUERY")}
                                    className="w-full flex items-center gap-2 text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 border transition cursor-pointer"
                                >
                                    <HelpCircle className="w-4 h-4 text-emerald-500" /> Product Inquiry
                                </button>
                                <button
                                    onClick={() => setIntent("COMPLAINT")}
                                    className="w-full flex items-center gap-2 text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 border transition cursor-pointer"
                                >
                                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Lodge a Complaint
                                </button>
                            </div>
                        ) : (
                            /* Input Form Area */
                            <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                    <span>Selected: <strong className="text-black">{intent}</strong></span>
                                    <button onClick={() => setIntent(null)} className="text-blue-600 hover:underline cursor-pointer">Change</button>
                                </div>

                                {/* 🔒 Security Verification Inputs for Order Query */}
                                {intent === "ORDER_QUERY" && (
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="First Name *"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last Name *"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Order ID (e.g. #4) *"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                                        />
                                        {/* 🔴 Inline Warning Note */}
                                        {(!orderId.trim() || !firstName.trim() || !lastName.trim()) && (
                                            <p className="text-[10px] text-rose-500 font-medium px-0.5">
                                                * Fill required fields (*) to verify.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {intent === "COMPLAINT" && (
                                    <input
                                        type="text"
                                        placeholder="Subject (e.g. Delayed Order)"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                                    />
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={intent === "ORDER_QUERY" ? "Message / Question (Optional)" : "Type your message..."}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        className="flex-1 p-2 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={loading}
                                        className="bg-black text-white p-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}