## Test Plan for Dispute System<!-- {"fold":true} -->

### Prerequisites Setup
1. We need three test addresses:
   - Buyer address
   - Seller address
   - Arbitrator address (4uXATaUbYJjvRu1QfZVBDbhsa8XtDEvUUJWPKanHhsja)
2. An active order (status = 1) to test with

### 1. Create a Dispute
```bash
# Create dispute as buyer
curl -X POST http://localhost:3000/api/disputes/197 \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Item not received as described",
    "files": []
  }'

# Create dispute as seller
curl -X POST http://localhost:3000/api/disputes/197 \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Proof of delivery attached",
    "files": []
  }'
```

### 2. Upload Evidence Files
```bash
# Upload evidence files for dispute
curl -X POST http://localhost:3000/api/s3/dispute \
  -F "orderId=197" \
  -F "address=BUYER_OR_SELLER_ADDRESS" \
  -F "files=@evidence1.jpg" \
  -F "files=@evidence2.pdf" \
  -H "Accept: image/jpeg, image/png, application/pdf"
```

### 3. Check Dispute Status
```bash
# Get specific dispute details
curl -X GET http://localhost:3000/api/disputes/197 \
  -H "Content-Type: application/json"

# Get all disputes (as arbitrator)
curl -X GET http://localhost:3000/api/disputes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ARBITRATOR_TOKEN"
```

### 4. Add Counterparty Response
```bash
# Add response from counterparty
curl -X POST http://localhost:3000/api/disputes/197/response \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Response to dispute claim with evidence",
    "files": []
  }'
```

### 5. Arbitrator Resolution
```bash
# Resolve dispute (arbitrator only)
curl -X PUT http://localhost:3000/api/disputes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ARBITRATOR_TOKEN" \
  -d '{
    "order_id": "197",
    "resolved": true,
    "winner_id": "WINNER_USER_ID"
  }'
```

### Test Scenarios to Verify

1. **Basic Flow**
   - Create order
   - Buyer initiates dispute
   - Upload evidence
   - Seller responds
   - Arbitrator resolves

2. **Error Cases**
```bash
# Try to create dispute on non-existent order
curl -X POST http://localhost:3000/api/disputes/999999 \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Test invalid order"
  }'

# Try to upload invalid file type
curl -X POST http://localhost:3000/api/s3/dispute \
  -F "orderId=197" \
  -F "address=BUYER_ADDRESS" \
  -F "files=@invalid.exe" \
  -H "Accept: image/jpeg, image/png, application/pdf"

# Try to resolve dispute as non-arbitrator
curl -X PUT http://localhost:3000/api/disputes \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "197",
    "resolved": true,
    "winner_id": "WINNER_USER_ID"
  }'
```

3. **Database Verification Queries**
```sql
-- Check dispute record
SELECT * FROM disputes WHERE order_id = 197;

-- Check user responses
SELECT * FROM user_disputes 
WHERE dispute_id IN (SELECT id FROM disputes WHERE order_id = 197);

-- Check uploaded files
SELECT * FROM dispute_files 
WHERE user_dispute_id IN (
  SELECT id FROM user_disputes 
  WHERE dispute_id IN (SELECT id FROM disputes WHERE order_id = 197)
);
```

### WebSocket Testing
To verify WebSocket notifications, you'll need to:

1. Connect to the WebSocket channels:
   - Buyer channel: `OrdersChannel_197_BUYER_ID`
   - Seller channel: `OrdersChannel_197_SELLER_ID`

2. Listen for events:
   - Dispute opened
   - Evidence submitted
   - Dispute resolved

Would you like me to provide more specific details about any of these steps or help you set up a particular test scenario?



