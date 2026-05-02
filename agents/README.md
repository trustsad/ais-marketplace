# AIS Marketplace — Agent JSON Reference

Each `.json` file in this folder defines one agent card on the marketplace.
The filename (without `.json`) must match the `id` field.

---

## Full field reference

```jsonc
{
  // ── Identity ──────────────────────────────────────────────────────────────
  "id": "ar-aging",            // URL slug — lowercase, hyphens only, matches filename
  "name": "AR Aging Agent",    // Display name shown on the card and detail page
  "tagline": "...",            // One-line subtitle shown under the name on the card
  "description": "...",        // Full paragraph shown on the agent detail page

  // ── Classification (drives sidebar filters) ───────────────────────────────
  "industry": ["Food & Beverage"],          // Array — can have multiple
                                            // Options: "Food & Beverage", "Life Sciences"
                                            // Adding a new value auto-creates a sidebar filter

  "function": "Finance / AR",              // Single string
                                            // Options: "Finance / AR", "Quality / RCA",
                                            // "Traceability", "Procurement", "Sales / CRM"
                                            // Adding a new value auto-creates a sidebar filter

  "productLine": "Business Central",       // Single string
                                            // Options: "Business Central", "JustFoodERP",
                                            // "bcFood", "Food & Beverage", "Apparel",
                                            // "Equipment", "Travers", "Made2Manage",
                                            // "M2M", "ProcessPro", "Ross"
                                            // Adding a new value auto-creates a sidebar filter

  // ── Availability ──────────────────────────────────────────────────────────
  "status": "live",            // "live" shows Try It button; "coming-soon" greys it out

  // ── AIS Backend ───────────────────────────────────────────────────────────
  "flowId": "d383b17f-...",    // The AIS flow UUID — drives the chat playground
                                // Use "placeholder" if not yet wired up

  // ── Card visuals ──────────────────────────────────────────────────────────
  "emoji": "💳",               // Any emoji — shown as the card icon
  "iconBg": "#EEEDFE",         // Background colour behind the emoji
                                //
                                // Recommended palette:
                                //   #EEEDFE  soft purple  (Finance)
                                //   #E1F5EE  soft green   (Quality / Supply Chain)
                                //   #E6F1FB  soft blue    (Life Sciences / Analytics)
                                //   #FAEEDA  soft amber   (Procurement)
                                //   #FBEAF0  soft pink    (Sales / CRM)
                                //   #FCEBEB  soft red     (Alerts / RCA)
                                //   #E0F5F5  soft teal    (Traceability)
                                //   #F0F0F0  soft grey    (Neutral)

  "tags": ["AR Ledger", "Customer table", "retrieveData"],
                                // Short chips shown on the card — list the BC tables
                                // or MCP tools the agent uses

  "featured": false,           // true = purple border highlight on the card

  // ── Social proof ──────────────────────────────────────────────────────────
  "rating": 4.8,               // Fallback rating if reviews array is empty
  "usageCount": 142,           // "Used by X+ teams" — shown on the card

  "reviews": [                 // Array — average stars computed automatically
    {
      "author": "Job Title, Company Name",
      "stars": 5,              // 1–5
      "comment": "Quote here."
    }
  ],

  // ── Detail page extras ────────────────────────────────────────────────────
  "videoUrl": "",              // YouTube/Vimeo embed URL — leave "" for placeholder
  "docsUrl": "",               // Link to docs — leave "" to hide the button
  "reviewLinks": []            // Reserved for future external review links
}
```

---

## Adding a new agent

1. Copy `ar-aging.json` as a starting point
2. Rename the file to match your new `id` (e.g. `rca-agent.json`)
3. Fill in all fields
4. `git add agents/rca-agent.json && git commit -m "Add RCA Agent" && git push`
5. Vercel auto-deploys — the card and detail page appear immediately

## Adding a new filter value

Just use a new string in `industry`, `function`, or `productLine`.
The sidebar filter appears automatically — no code changes needed.

## Emoji quick reference

| Category | Options |
|----------|---------|
| Finance / AR | 💳 💰 📊 📈 🏦 🧾 |
| Supply Chain | 📦 🚛 🔗 🏭 📋 |
| Quality / Compliance | 🔬 🧪 ✅ 🚨 🛡️ |
| Sales / CRM | 🤝 🎯 📞 👥 💼 |
| Operations | ⚙️ 🔧 📐 🏗️ 📅 |
| Analytics | 📊 📈 🔍 💡 🧮 |
