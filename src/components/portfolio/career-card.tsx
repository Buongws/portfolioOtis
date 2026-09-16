import { AssetIcon } from "@/components/ui/asset-icon";
import { toolIcons } from "@/data/portfolio";
import type { CareerEntry } from "@/types/portfolio";

export function CareerCard({ entry }: { entry: CareerEntry }) {
  return (
    <article className="career-card" style={{ backgroundColor: entry.color }}>
      <span className="career-number" aria-hidden="true">
        {entry.id}
      </span>
      <div>
        <h3>{entry.role}</h3>
        <div className="career-meta">
          <span>{entry.company}</span>
          <span>{entry.period}</span>
          {entry.freelance && <span>Freelancer</span>}
        </div>
      </div>
      <div className="career-description">
        {entry.description.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      <ul className="tool-list">
        {entry.tools.map((tool) => (
          <li key={tool}>
            {toolIcons[tool] ? (
              <AssetIcon src={`/icons/${toolIcons[tool]}`} size={32} />
            ) : (
              <span className="ai-label" aria-hidden="true">
                AI
              </span>
            )}
            <span>{tool}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
