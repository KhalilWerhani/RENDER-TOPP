export const EMAIL_VERIFY_TEMPLATE = `
<td align="center" class="esd-stripe">
  <table width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" style="background-color:transparent">
    <tbody>
      <tr>
        <td align="left" class="esd-structure es-p10">
          <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td width="580" valign="top" align="center" class="esd-container-frame">
                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td align="center" class="esd-block-image es-p10b">
                          <img src="cid:top-juridique-logo" alt="Top-Juridique" width="150" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center" class="esd-block-text">
                          <h1>Bienvenue chez Top-Juridique !</h1>
                          <p>Bonjour <strong>{{email}}</strong>,</p>
                          <p>Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous compter parmi nous !</p>
                          <p>Commencez dès maintenant à découvrir nos services juridiques en ligne.</p>
                          <p>Bien à vous,<br><strong>L'équipe Top-Juridique</strong></p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" class="esd-block-button">
                          <a href="https://yourdomain.com/login" target="_blank" style="padding:10px 20px;background-color:#0248F7;color:white;text-decoration:none;border-radius:4px;">
                            Accéder à votre espace
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
`;
 

export const PASSWORD_VERIFY_TEMPLATE = `
<td bgcolor="#fafafa" align="center" class="esd-stripe" style="background-color:#fafafa;">
  <table width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-footer-body">
    <tbody>
      <tr>
        <td bgcolor="#0b5394" align="left" class="esd-structure es-p20" style="background-color:#0b5394;">
          <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td width="560" valign="top" align="center" class="esd-container-frame">
                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td align="center" class="esd-block-image es-p10b">
                          <img src="cid:top-juridique-logo" alt="Top-Juridique" width="150" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center" class="esd-block-text">
                          <h2 style="color:#ffffff;">Réinitialisation de mot de passe</h2>
                          <p style="color:#ffffff;">Bonjour <strong>{{email}}</strong>,</p>
                          <p style="color:#ffffff;">Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
                          <p style="color:#ffffff;">Veuillez utiliser le code OTP suivant :</p>
                          <h3 style="color:#ffffff; font-size:24px;">{{otp}}</h3>
                          <p style="color:#ffffff;">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" class="esd-block-text">
                          <p style="font-size:12px;color:#ffffff;">Besoin d'aide ? <a href="https://yourdomain.com/contact" style="color:#ffffff;">Contactez-nous</a></p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
`;
