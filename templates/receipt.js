const tableRow = (orderedPaintings) => {
  let res = ''

  orderedPaintings.map(painting => {
    res += `
    <tr>
    <td>${painting.name}</td>
    <td>1</td>
    <td>₱${painting.price}</td>
    <td>₱${painting.price}</td>
  </tr>
    `
  })

  return res
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const receiptPDFContent = (user) => {
  const total = user.orderedPaintings.reduce((previousValue, currentValue) => previousValue + currentValue.price, 0)
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            margin: 32px;
          }
          .company-info {
            display: flex;
          }
    
          .address {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
    
          .invoice {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: center;
            align-items: end;
            gap: 16px;
          }
    
          .invoice-child {
            border-bottom: 1px solid black;
            text-align: center;
          }
    
          .payment-due {
            width: 100%;
            display: flex;
            justify-content: end;
            font-style: italic;
          }
    
          .ship-info {
            display: flex;
          }
    
          .ship-info-child {
            width: 100%;
          }
    
          .ship-info-child h3 {
            padding-bottom: 16px;
            border-bottom: 1px solid black;
          }
    
          .ship-user-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
    
          .ship-user-details .address {
            width: 250px;
          }
    
          td,
          th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <div>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/vmeme-e34ec.appspot.com/o/vmeme_logo.jpg?alt=media&token=7a6e8fc2-315f-4347-8043-fc60e3c0e764"
            width="300px"
            height="120px"
          />
        </div>
        <div class="company-info">
          <div class="address">
            <span>Vmeme Contemporary Art Gallery</span>
            <span>2/F Commercenter Building 2, Filinvest Ave cor.</span>
            <span>Commerce Ave and East Asia Drive, Filinvest </span>
            <span>Corporate City Alabang</span>
            <span>09175798768</span>
            <span>vmemecontemporary@gmail.com</span>
          </div>
          <div class="invoice">
          <div style="width: 200px; text-align: center">
          <div class="invoice-child">Date</div>
          <span style="text-align: center; width: 100%">${new Date().toLocaleString().split(',')[0]}</span>
        </div>
        <div style="width: 200px; text-align: center">
          <div class="invoice-child">Order ID</div>
          <span style="text-align: center; width: 100%">${user.orderId ?? user.referenceID}</span>
        </div>
          </div>
        </div>
        <div class="payment-due">Payment due upon receipt.</div>
        <div class="ship-info">
          <div class="ship-info-child">
            <h3>Shipped to</h3>
            <div class="ship-user-details">
              <div><strong>Name</strong>: ${capitalizeFirstLetter(user.fullName.first)} ${capitalizeFirstLetter(user.fullName.last)}</div>
              <div><strong>Address</strong>:</div>
              <div class="address">
                ${user.address}
              </div>
              <div><strong>Contact No</strong>: ${user.phoneNumber}</div>
            </div>
          </div>
        </div>
    
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px">
          <tr>
            <th>PAINTING</th>
            <th>QTY</th>
            <th>UNIT PRICE</th>
            <th>TOTAL</th>
          </tr>
          ${tableRow(user.orderedPaintings)}

        </table>
    
        <div style="display: flex; justify-content: end; margin-top: 32px">
          <div>
            <div style="display: flex">
              <div style="width: 100px">SUBTOTAL</div>
              <div style="width: 100px; text-align: end; padding-right: 12px">
              ₱${total}
              </div>
            </div>
            <div style="display: flex">
              <div style="width: 100px">TOTAL</div>
              <div style="width: 100px; text-align: end; padding-right: 12px">
                <strong>₱${total}</strong>
              </div>
            </div>
            <div style="display: flex">
              <div style="width: 100px">REMARKS</div>
              <div style="width: 100px; text-align: end; padding-right: 12px">
                PAID/${String(user.paymentMethods).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
    
        <footer style="text-align: center; margin-top: 32px">
          <h1>THANK YOU</h1>
          <div style="font-size: 13px; margin-top: 16px; font-style: italic">
            For questions concerning this invoice, please contact
          </div>
          <div style="margin-top: 16px">
            <div>Vmeme Contemporary Art Gallery</div>
            <div>2/F Commercenter Building 2, Filinvest Ave cor.</div>
            <div>
              Commerce Ave and East Asia Drive, Filinvest Corporate City Alabang
            </div>
            <div>09175798768</div>
            <div>vmemecontemporary@gmail.com</div>
            <span>https://www.vmeme.shop/</span>
          </div>
        </footer>
      </body>
    </html>
    
    `
}