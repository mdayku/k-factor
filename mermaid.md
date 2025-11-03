```mermaid
flowchart LR
  subgraph Client (Web)
    RP[Results Page]-->ShareCard
    RP-->CTA[Challenge/Invite CTA]
    PresenceUI-->WS[(Socket.IO - future)]
  end

  CTA-- open smart link --> SL[Smart Link Service]
  SL-- validate & attribute --> ATTR[(Attribution Memory)]
  SL-- deep link --> FV[First Value Moment]

  subgraph Agents (MCP-style)
    ORCH[Orchestrator]
    EXP[Experimentation]
  end

  Events[(Event Bus Lite)]:::bus
  SDK[(SDK pkg)] --> Events
  RP-->SDK
  FV-->SDK
  ORCH<-->EXP
  Events-->ORCH
  Events-->EXP
  EXP-->Dash[Console K Metrics]

  classDef bus fill:#eef,stroke:#99f,stroke-width:1px
```

```mermaid
sequenceDiagram
  participant U as User A
  participant RP as Results Page
  participant SL as Smart Link
  participant EX as Experimentation
  participant B as Buddy (User B)

  U->>RP: View results (score, gap)
  RP->>RP: Render ShareCard + "Beat my score"
  RP->>SL: Click smart link (signed context)
  SL->>EX: Log exposure + last-touch
  SL->>B: Deep link to micro-deck (FVM)
  B->>EX: Account created? FVM reached?
  EX-->>RP: K metrics updated (console)
```
