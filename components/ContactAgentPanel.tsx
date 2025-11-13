"use client";

import { useState } from "react";
import { ContactAgentForm } from "./ContactAgentForm";
import { ScheduleViewingModal } from "./ScheduleViewingModal";
import type { AgentInfo } from "@/app/api/properties/data";

interface ContactAgentPanelProps {
  agent: AgentInfo;
  propertyId: string;
  propertyTitle: string;
}

export function ContactAgentPanel({
  agent,
  propertyId,
  propertyTitle,
}: ContactAgentPanelProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:block">
        <ContactAgentForm
          agent={agent}
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          onScheduleViewing={() => setIsScheduleOpen(true)}
          className="sticky top-4"
        />
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsContactSheetOpen(true)}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg"
        >
          Contact Agent
        </button>

        {isContactSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
            <div className="rounded-t-3xl bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">
                  Contact Agent
                </h3>
                <button
                  type="button"
                  onClick={() => setIsContactSheetOpen(false)}
                  className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground"
                >
                  Close
                </button>
              </div>
              <ContactAgentForm
                agent={agent}
                propertyId={propertyId}
                propertyTitle={propertyTitle}
                onScheduleViewing={() => {
                  setIsContactSheetOpen(false);
                  setIsScheduleOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <ScheduleViewingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </>
  );
}
