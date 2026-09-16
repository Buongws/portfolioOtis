import Image from "next/image";

type SkillIconId = "ui-ux" | "research" | "design-system" | "ai-tool";

function UiUxMark() {
  return (
    <span className="active-mark active-mark-ui" aria-hidden="true">
      <Image src="/icons/ui-ux-active.svg" alt="" width={83} height={83} />
      <span className="ui-monitor" />
      <span className="ui-bars">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="ui-handles ui-handles-top">
        <i />
        <i />
      </span>
      <span className="ui-handles ui-handles-bottom">
        <i />
        <i />
      </span>
    </span>
  );
}

function ResearchMark() {
  return (
    <span className="active-mark active-mark-research" aria-hidden="true">
      <Image src="/icons/research-active.svg" alt="" width={99} height={99} />
      <Image
        className="research-marker"
        src="/icons/research-active-marker.svg"
        alt=""
        width={28}
        height={28}
      />
      <i className="research-ray ray-north" />
      <i className="research-ray ray-south" />
      <i className="research-ray ray-northwest" />
      <i className="research-ray ray-southeast" />
      <i className="research-ray ray-northeast" />
      <i className="research-ray ray-southwest" />
      <i className="research-ray ray-east" />
      <i className="research-ray ray-west" />
    </span>
  );
}

function DesignSystemMark() {
  return (
    <span className="active-mark active-mark-design-system" aria-hidden="true">
      <Image
        className="team-blade team-blade-one"
        src="/icons/design-system-active-a.svg"
        alt=""
        width={114}
        height={36}
      />
      <Image
        className="team-blade team-blade-two"
        src="/icons/design-system-active-b.svg"
        alt=""
        width={121}
        height={36}
      />
      <span className="team-ticks">
        <i />
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

function AiToolMark() {
  return (
    <span className="active-mark active-mark-ai" aria-hidden="true">
      <Image src="/icons/ai-tool-active.svg" alt="" width={117} height={103} />
    </span>
  );
}

const activeMarks = {
  "ui-ux": <UiUxMark />,
  research: <ResearchMark />,
  "design-system": <DesignSystemMark />,
  "ai-tool": <AiToolMark />,
} satisfies Record<SkillIconId, React.ReactNode>;

export function SkillIcon({ id }: { id: SkillIconId }) {
  return (
    <span className="skill-icon">
      <Image
        src={`/icons/${id}.png`}
        alt=""
        width={120}
        height={120}
        className="skill-default-icon"
        unoptimized
      />
      <span className={`skill-active-icon skill-active-${id}`}>
        {activeMarks[id]}
      </span>
    </span>
  );
}
