# JSON Output

This directory contains all historical content in **JSON format** - a structured, machine-readable data format perfect for APIs, databases, and modern web applications.

## Files

- **`kings.json`** - Array of 188 king objects with complete biographical data
- **`kingdoms.json`** - Array of 15 kingdom objects with historical information
- **`complete.json`** - Combined file with metadata and all data in one place

## Structure

### Kings JSON Schema
```json
{
  "slug": "vijaya",
  "title": "King Vijaya",
  "reign": "543–505 BCE",
  "kingdom": "Tambapanni",
  "biography": "Full biography text...",
  "sections": [
    {
      "heading": "Biography",
      "content": ["Paragraph 1...", "Paragraph 2..."],
      "infoBoxes": [
        {
          "title": "Historical Significance",
          "content": "Details..."
        }
      ]
    }
  ]
}
```

### Kingdoms JSON Schema
```json
{
  "slug": "anuradhapura",
  "title": "Anuradhapura Kingdom",
  "reign": "437 BCE – 1017 CE",
  "biography": "Overview text...",
  "sections": [...]
}
```

### Complete JSON Structure
```json
{
  "meta": {
    "title": "Sri Lanka History Data",
    "description": "Historical kingdoms and monarchs of Sri Lanka",
    "generated": "2025-11-24T...",
    "totalKings": 188,
    "totalKingdoms": 15
  },
  "kingdoms": [...],
  "kings": [...]
}
```

## Usage Examples

### JavaScript/Node.js
```javascript
const data = require('./json-output/complete.json');
console.log(data.meta.totalKings); // 188
console.log(data.kings[0].title); // First king
```

### Python
```python
import json
with open('json-output/complete.json') as f:
    data = json.load(f)
print(f"Total kings: {data['meta']['totalKings']}")
```

### REST API
Use these files to power a REST API endpoint:
```
GET /api/kings         -> Return all kings
GET /api/kings/:slug   -> Return specific king
GET /api/kingdoms      -> Return all kingdoms
```

## Benefits

✅ **Machine-readable** - Perfect for APIs and databases  
✅ **Structured data** - Well-defined schema  
✅ **Language agnostic** - Works with any programming language  
✅ **Web-ready** - Direct use in JavaScript/TypeScript applications  
✅ **Database import** - Import into MongoDB, PostgreSQL, etc.  
✅ **Search & filter** - Easy to query and manipulate

## Use Cases

- 📱 Mobile app backend data
- 🌐 RESTful API responses
- 🔍 Search engine indexing
- 📊 Data analysis and visualization
- 🗄️ Database seeding
- 🤖 AI/ML training data

---

Converted from HTML on November 24, 2025
