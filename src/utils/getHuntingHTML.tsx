import {QRMinifiedData} from '@root/state/types';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import {isEmpty} from 'lodash';
import {formatDateTimeLT} from './time';

const getHuntingHTML = (qr: QRMinifiedData) => {
  return `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial';
                padding: 16px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                border: 1px solid ${theme.colors.primaryUltraLight};
              }
              th, td {
                font-size: 30pt;
                padding: 10pt;
              }
              th {
                text-align: left;
                background-color: ${theme.colors.primaryUltraLight};
              }
              th > span {
                font-weight: normal;
                font-size: 16pt;
              }
              .thSmall {
                font-size: 20pt;
              }
              .metadataXSmall {
                margin-bottom: 24px;
                font-size: 20pt;
              }
              h1 {
                font-size: 30pt;
              }
              h2, p {
                font-size: 26pt;
              }
              h2 {
                margin-bottom: 10pt;
              }
              p {
                margin: 0;
                padding: 0;
              }
              .metadata {
                padding: 0 0 16px 0;
                font-size: 16pt;
                width: 100%;
                text-align: right;
              }
              .lootdata {
                padding-left: 40px;
              }
              .lootData > p {
                margin: 0 0 4px 0;
              }
            </style>
          </head>
          <body >
            <div class="metadata">
              QR kodo sugeneravimo laikas:</br>
              ${formatDateTimeLT(qr.m.t)}</br>
              
            </div>
            <table>
              <tr>
                <th>MPV naudotojas</th>
              </tr>
              <tr>
                <td>${qr.d.t}</td>
              </tr>
              <tr>
                <th>MPV</th>
              </tr>
              <tr>
                <td>${qr.d.a}</td> 
              </tr>
              <tr>
                <th>Medžioklės vadovas </br><span class="thSmall">(vardas pavardė, medžiotojo bilieto nr.)</span></th>
              </tr>
              <tr>
                <td>${qr.d.m}</td> 
              </tr>
              <tr>
                <th>Medžioklės pradžia</th>
              </tr>
              <tr>
                <td>
                ${formatDateTimeLT(qr.d.s)}

              </td> 
              </tr>
              <tr>
                <th>Medžioklės pabaiga</th>
              </tr>
              <tr>
                <td>
                ${qr.d.e ? formatDateTimeLT(qr.d.e) : ' - '}
              </td> 
              </tr>
              
              <tr>
                <th>Tikrintas medžiotojas </br><span class="thSmall">(vardas pavardė, medžiotojo bilieto nr.)</span></th>
              </tr>
              <tr>
                <td>
                ${qr.d.h}
              </td> 
              </tr>
            </table>
            </br>
            </br>
            </br>
            <h1>Laimikiai:</h1>
            ${
              qr.d.l
                ? qr.d.l
                    .map(
                      u => `
                          ${
                            !isEmpty(u.d) &&
                            u.d
                              .map(
                                l => `
                                <h2>${l.n} x${l.a}${
                                  l.c ? ` - ${strings[l.c]}` : ''
                                }:</h2>
                                <div class="lootData">
                                  <p>${u.h}</p>
                                  <p>${formatDateTimeLT(l.t)}</p>
                                  
                                  ${
                                    l.h
                                      ? `<p>Šakų skaičius: (kairys ragas: ${l.h.l}, dešinys ragas: ${l.h.r})</p>`
                                      : ''
                                  }
                                  ${l.g ? `<p>Amžius: ${strings[l.g]}</p>` : ''}
                                </div>
                              `,
                              )
                              .join('')
                          }
                    `,
                    )
                    .join('')
                : ''
            }
          </body>
        </html>
      `;
};

export default getHuntingHTML;
