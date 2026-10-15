import React from "react";
import { VosforIcon } from "../icons/WarframeIcons";
import { Layers3, ArrowRight, Info } from "lucide-react";

export default function ExchangeRules() {
  return (
    <div className="exchange-rules">
      <div>
        <span className="rule-icon">
          <VosforIcon className="w-5 h-5" />
        </span>
        <span>
          <strong>
            200 <span>Vosfor</span>
          </strong>
          <small>ONE COLLECTION</small>
        </span>
      </div>
      <span className="rule-connector">
        <span />
        <ArrowRight size={16} />
        <span />
      </span>
      <div>
        <span className="rule-icon">
          <Layers3 size={21} />
        </span>
        <span>
          <strong>
            3 <span>random Arcanes</span>
          </strong>
          <small>EVERY OPENING</small>
        </span>
      </div>
      <p>
        <Info size={15} /> Dissolve with Loid in the Sanctum Anatomica.
      </p>
    </div>
  );
}
