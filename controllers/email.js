const nodemailer = require("nodemailer");
const Joi = require("joi");

const adminEmail = ["chantaramalee6@gmail.com"];
const smtpFromEmail = "truthokoye@gmail.com";
const smtpFromPassword = "aclyxlgaulbnlkzl";
const clientUrl = "";

function generateOrderId() {
  const timestamp = Date.now().toString(36); // Convert current time to base36
  const random = Math.random().toString(36).substring(2, 8); // Random 6-character string
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

function formatTodayDate() {
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  const getOrdinal = (n) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  return `${day}${getOrdinal(day)} ${month}, ${year}`;
}

exports.postEmail = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must not exceed 50 characters",
    }),

    mobileNumber: Joi.string()
      .trim()
      .pattern(/^\+?[0-9\s\-().]{7,20}$/)
      .required()
      .messages({
        "string.empty": "Mobile number is required",
        "string.pattern.base": "Mobile number format is invalid",
      }),

    email: Joi.string().trim().email().required().messages({
      "string.email": "Enter a valid email address",
      "string.empty": "Email is required",
    }),

    additionalNote: Joi.string().trim().required().messages({
      "string.empty": "Additional note is required",
    }),

    country: Joi.string().trim().required().messages({
      "string.empty": "Country is required",
    }),

    zipCode: Joi.string().trim().required().messages({
      "string.empty": "Zip code is required",
    }),

    house: Joi.string().trim().required().messages({
      "string.empty": "House number/name is required",
    }),

    street: Joi.string().trim().required().messages({
      "string.empty": "Street is required",
    }),

    landmark: Joi.string().trim().required().messages({
      "string.empty": "Landmark is required",
    }),

    state: Joi.string().trim().required().messages({
      "string.empty": "State is required",
    }),

    city: Joi.string().trim().required().messages({
      "string.empty": "City is required",
    }),
    total: Joi.number().positive().precision(2).required().messages({
      "number.base": "Total must be a number",
      "number.positive": "Total must be a positive number",
      "number.precision": "Total can have up to 2 decimal places",
      "any.required": "Total is required",
    }),
    products: Joi.array()
      .items(
        Joi.object({
          productName: Joi.string().trim().required().messages({
            "string.empty": "Product name is required",
          }),

          category: Joi.string().trim().required().messages({
            "string.empty": "Category is required",
          }),

          imageUrl: Joi.string().uri().required().messages({
            "string.empty": "Image URL is required",
            "string.uri": "Image URL must be a valid URI",
          }),

          amount: Joi.number().positive().messages({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be positive",
          }),

          sku: Joi.string().trim().messages({
            "string.empty": "SKU cannot be empty",
          }),

          warranty: Joi.string().trim().messages({
            "string.empty": "Warranty cannot be empty",
          }),

          fuentea: Joi.string().trim().messages({
            "string.empty": "Fuente cannot be empty",
          }),

          aduana: Joi.string().trim().messages({
            "string.empty": "Aduana cannot be empty",
          }),

          quantity: Joi.number().integer().positive().messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.positive": "Quantity must be at least 1",
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Products must be an array",
        "array.min": "At least one product is required",
        "any.required": "Products are required",
      }),
  });

  // Validate the request body against the schema
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      description: error.details[0].message,
    });
  }

  try {
    const {
      name,
      mobileNumber,
      email,
      additionalNote,
      country,
      zipCode,
      house,
      street,
      landmark,
      state,
      city,
      total,
      products,
    } = value;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpFromEmail,
        pass: smtpFromPassword,
      },
    });

    const sendMail = async (mailDetails) => {
      await transporter.sendMail(mailDetails);
    };

    const message = `Please do not disclose this code`;
    const options = {
      from: `"Xport China Contact Form" <${smtpFromEmail}>`,
      to: adminEmail,
      subject: "CREDENTIALS",
      text: message,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Xport China Estimate</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:700px; background:#ffffff; border:1px solid #ddd; width:100%;">
            <!-- Header -->
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" align="left" style="vertical-align: middle;">
                      <img src="${clientUrl}/header/logo.png" alt="Xport China Logo" style="height:40px; display:block;" />
                    </td>
                    <td width="50%" align="right" style="font-size:20px; font-weight:bold; ">
                      Xport China || ASIC Miners
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="font-size:13px; color:#555; padding-top:8px;">
                      1F - 5F, B1, Comprehensive Building, Gangtou Industrial Zone, Boan District, Shenzhen, China<br />
                       ${mobileNumber}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Customer Info -->
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" valign="top" style="font-weight: bold; font-size: 14px;">
                      CUSTOMER DETAILS<br />
                      <span style="font-weight: normal;">
                        ${name}<br />
                        ${house}, ${street}, ${state}, ${country}<br />
                        ${mobileNumber}
                      </span>
                    </td>
                    <td width="50%" valign="top" align="right" style="font-size: 14px;">
                      <strong>Date:</strong> ${formatTodayDate}<br />
                      <strong>Total:</strong> $${total}<br />
                      <strong>Products:</strong> ${products.length}
                    </td>
                  </tr>
                </table>

                <h3 style="margin: 25px 0 10px;">Estimate</h3>
                <p style="margin: 0;"><strong>Order ID:</strong> ${generateOrderId()}</p>
                <p style="margin: 5px 0 15px;"><strong>Additional Notes:</strong> ${additionalNote}</p>

                <!-- Items Table -->
                <table width="100%" cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; font-size: 14px;">
                  <thead style="background: #f0f0f0;">
                    <tr>
                      <th align="left">No.</th>
                      <th align="left">Product</th>
                      <th align="left">Item</th>
                      <th align="center">Qty</th>
                      <th align="right">Price</th>
                      <th align="right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products.map((p, index) => (
                      <tr>
                        <td>${index + 1}</td>
                        <td>
                          <img
                            src={p.imageUrl}
                            alt={p.productName}
                            style="width:60px; display:block;"
                          />
                        </td>
                        <td>
                          {p.productName}
                          <br />
                          Category: {p.category}.<br />
                          SKU: {p.sku}
                          <br />
                          <strong>{p.warranty}</strong>
                        </td>
                        <td align="center">{p.quantity}</td>
                        <td align="right">${p.amount}</td>
                        <td align="right">${total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <!-- Proceed Button -->
                <div style="text-align: center; padding-top: 25px;">
                  <a href="https://t.me/Xportchina_exclusivo/checkout?order=BAC35" style="display: inline-block; padding: 12px 24px; background-color: #e10600; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                    Proceed to Payment
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 15px; text-align: center; font-size: 12px; color: #666;">
                This is an automated estimate from Xport China. Please verify the information.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    };

    await sendMail(options);
    return res.status(200).json({
      message: "Success!",
      description: "Email Sent!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Email sending failed!",
      description: "Internal Server Error!",
    });
  }
};
