

const iteratePaintings = (orderedPaintings) => {
    let res = ''
    orderedPaintings.map(painting => {
        res += `
        <div>-${painting.name}</div>
        `
    })
    return res
}

const tableRow = (orders) => {
    let res = ''

    orders.map(order => {
        res += `
        <tr>
        <td>${order.orderId}</td>
        <td>${order.user.fullName.first} ${order.user.fullName.last}</td>
        <td>
          <div>
            ${iteratePaintings(order.orderedPaintings)}
          </div>
        </td>
        <td>To be issued</td>
      </tr>
        `
    })

    return res
}

const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

export const toBeIssuedCOA = (orders) => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', options);
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
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 32px">
      <tr>
        <th>Order Id</th>
        <th>Buyer</th>
        <th>Paintings</th>
        <th>COA</th>
      </tr>

      ${tableRow(orders)}
    </table>

    <footer style="margin-top: 32px; color: gray; font-style: italic">
      This data was generated on ${formattedDate}
    </footer>
  </body>
</html>
    `
}