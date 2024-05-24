import React from "react";

const ChatLoadingSkeleton: React.FC = () => {
    return (
        <div className="border border-none animate-pulse gap-4">
                <div className="rounded-xl flex flex-col justify-between items-center w-full space-x-4 space-y-8">
                    <div className="w-full max-w-[29rem] space-y-2">
                        <div className="w-full bg-gray-100 h-32 rounded-xl"></div>
                    </div>

                    <div className="w-full max-w-[29rem] space-y-2">
                        <div className="w-full bg-gray-100 h-32 rounded-xl"></div>
                    </div>

                    <div className="w-full max-w-[29rem] space-y-2">
                        <div className="w-full bg-gray-100 h-32 rounded-xl"></div>
                    </div>

                    <div className="w-full max-w-[29rem] space-y-2">
                        <div className="w-full bg-gray-100 h-32 rounded-xl"></div>
                    </div>
                </div>
        </div>
    )
}

export default ChatLoadingSkeleton;