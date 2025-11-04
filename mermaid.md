# VT K-Factor System Architecture

## High-Level System Architecture

```mermaid
flowchart TB
  subgraph "Client (Next.js Web App)"
    Auth[Auth System<br/>NextAuth.js]
    Study[Study Mode<br/>Geography Curriculum]
    Practice[Practice Page<br/>Results & Sharing]
    Presence[Presence Layer<br/>Leaderboards & Cohorts]
    Dashboard[Analytics Dashboard<br/>K-Factor Tracking]
    Profile[User Profile<br/>Settings & Stats]
    
    Auth --> Study
    Auth --> Practice
    Auth --> Presence
    Auth --> Dashboard
    Auth --> Profile
    
    Study --> Practice
    Practice --> ShareCard[Share Cards<br/>Email Invites]
    
    EventTracker[Event Tracking<br/>useTracking hooks]
    Study -.-> EventTracker
    Practice -.-> EventTracker
    Presence -.-> EventTracker
  end
  
  subgraph "Agents Service (Express)"
    Orch[Orchestrator<br/>Loop Selection]
    Pers[Personalization<br/>+ OpenAI GPT-4o-mini]
    Inc[Incentives<br/>Rewards & Economy]
    Social[Social Presence<br/>Activity Signals]
    Tutor[Tutor Advocacy<br/>Share Packs]
    Trust[Trust & Safety<br/>Fraud + COPPA]
    Exp[Experimentation<br/>A/B Testing]
    CopyKit[Copy Kit<br/>Templates]
    
    Orch --> Pers
    Pers --> CopyKit
    Pers --> OpenAI[OpenAI API<br/>GPT-4o-mini]
  end
  
  subgraph "Infrastructure"
    DB[(Supabase<br/>PostgreSQL)]
    Email[Email Service<br/>Nodemailer + SMTP]
    Vercel[Vercel<br/>Web Hosting]
    Railway[Railway<br/>Agents Hosting]
  end
  
  ShareCard --> Pers
  ShareCard --> Email
  Practice --> DB
  EventTracker --> DB
  Dashboard --> DB
  
  Orch --> DB
  Trust --> DB
  Exp --> DB
  
  Vercel -.hosts.-> Auth
  Vercel -.hosts.-> Study
  Railway -.hosts.-> Orch
  
  classDef ai fill:#e1f5ff,stroke:#0066cc,stroke-width:2px
  classDef infra fill:#f0f0f0,stroke:#666,stroke-width:1px
  
  class Pers,OpenAI ai
  class DB,Email,Vercel,Railway infra
```

## Viral Loop Flow (with Real AI)

```mermaid
sequenceDiagram
  participant User as User A (Student)
  participant Web as Web App
  participant Orch as Orchestrator Agent
  participant Pers as Personalization Agent
  participant AI as OpenAI GPT-4o-mini
  participant Email as Email Service
  participant DB as Database
  participant Friend as User B (Friend)

  User->>Web: Complete practice (score: 9/10)
  Web->>Web: Render results page with share CTA
  User->>Web: Click "Challenge a Friend"
  Web->>Orch: POST /agents/orchestrate
  Orch->>Orch: Select optimal loop (buddy-challenge)
  Orch-->>Web: { loop: "buddy-challenge", timing: "now" }
  
  Web->>Pers: POST /agents/personalization
  Note over Pers: Context: student, Algebra, score=9
  Pers->>AI: Generate unique invite copy
  AI-->>Pers: { headline, body, cta, aiGenerated: true }
  Pers-->>Web: AI-generated copy + metadata
  
  Web->>DB: Create SignedLink + Event (invite.sent)
  Web->>Email: sendInviteEmail(friend@example.com)
  Email-->>Friend: Beautiful HTML email with AI copy
  Web-->>User: ✅ Invite sent!
  
  Friend->>Web: Click invite link (challenge/AbC123)
  Web->>DB: Fetch SignedLink + track invite.opened
  Web-->>Friend: Challenge page with AI copy + "✨ Personalized by AI"
  
  Friend->>Web: Click "Start Challenge"
  Web->>Web: Redirect to /auth/signup?ref=sl_xyz
  Friend->>Web: Complete signup
  Web->>DB: Create User + Attribution + Event (account.created)
  
  Friend->>Web: Complete challenge (score: 8/10)
  Web->>DB: Track fvm.reached event
  Web-->>Friend: Results + "You unlocked rewards!"
  
  Note over DB: K-Factor calculation:<br/>K = (referred users) / (seed users)<br/>Attribution chain complete!
```

## Event Tracking for AI Retraining

```mermaid
flowchart LR
  subgraph "Client-Side"
    Page[React Page]
    Hooks[useTracking<br/>useScrollTracking]
    
    Page --> Hooks
  end
  
  subgraph "API"
    TrackAPI[POST /api/tracking/interaction]
  end
  
  subgraph "Database"
    Events[(Event Table)]
  end
  
  subgraph "Future ML Pipeline"
    ETL[ETL Process]
    Model[ML Model<br/>Loop Optimization]
    
    Events --> ETL
    ETL --> Model
  end
  
  Hooks -->|click, scroll, form_submit| TrackAPI
  TrackAPI -->|Store interaction events| Events
  
  Model -.->|Improved agent decisions| Pers2[Personalization Agent]
  
  classDef future fill:#fff3cd,stroke:#ffc107,stroke-width:2px,stroke-dasharray: 5 5
  class ETL,Model,Pers2 future
```

## Database Schema (Simplified)

```mermaid
erDiagram
  User ||--o{ Event : generates
  User ||--o{ Attribution : "referred by"
  User ||--o{ SignedLink : creates
  User ||--o{ ParentalConsent : "requires (if minor)"
  
  SignedLink ||--o{ Attribution : "leads to"
  SignedLink ||--o{ Event : "tracked via"
  
  Event {
    string id
    string type
    string userId
    string surface
    json metadata
    datetime createdAt
  }
  
  User {
    string id
    string email
    string role
    int age
    boolean isMinor
    boolean parentalConsent
  }
  
  SignedLink {
    string id
    string shortCode
    string loop
    string persona
    json metadata
    datetime expiresAt
  }
  
  Attribution {
    string id
    string userId
    string signedLinkId
    string touchpoint
  }
  
  ParentalConsent {
    string id
    string childUserId
    string parentEmail
    string consentToken
    boolean consentGiven
  }
```

## Deployment Architecture

```mermaid
flowchart TB
  subgraph "Vercel (Web Hosting)"
    WebApp[Next.js App<br/>Port 3000]
    WebAPI[API Routes<br/>/api/*]
    
    WebApp --> WebAPI
  end
  
  subgraph "Railway (Agents Hosting)"
    AgentAPI[Express Server<br/>Port 4000]
    Agents[7 MCP Agents<br/>+ OpenAI Integration]
    
    AgentAPI --> Agents
  end
  
  subgraph "Supabase (Database)"
    PG[(PostgreSQL<br/>13 Tables)]
  end
  
  subgraph "External Services"
    OpenAIExt[OpenAI API<br/>GPT-4o-mini]
    SMTP[SMTP Server<br/>Gmail / SendGrid]
  end
  
  WebAPI --> PG
  WebAPI --> AgentAPI
  AgentAPI --> PG
  Agents --> OpenAIExt
  WebAPI --> SMTP
  
  User[End User] --> WebApp
  
  classDef deploy fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
  class WebApp,AgentAPI deploy
```
