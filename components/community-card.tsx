import React from "react";
import Card from "./ui/card";

export default function CommunityCard({ avatar, name, tag, time, text, accent }: { avatar?: string; name: string; tag?: string; time?: string; text: string; accent?: string; }) {
  return (
    <Card className="mb-4">
      {accent && <div className="top-stripe" style={{ background: accent }} />}
      <div className="flex items-start gap-4">
        <img src={avatar ?? "/avatar.jpg"} alt={name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{name} {tag && <span className="text-sm text-gray-500 ml-2">{tag}</span>}</div>
              <div className="text-xs text-muted-foreground">{time}</div>
            </div>
          </div>
          <p className="mt-3 text-gray-700">{text}</p>
          <div className="flex gap-6 mt-3 text-sm text-gray-400">
            <div>❤ 342</div>
            <div>💬 28</div>
            <div>🔁 3</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
