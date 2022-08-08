import { SUPER_SECRET } from 'virtual:env';
import { PATH } from 'virtual:env:runtime';
export function render() {
	const html = `
    <div>
      <h1>server env</h1>
      <pre id="server-env">SUPER_SECRET = ${SUPER_SECRET}\nPATH = ${PATH.substring(0, 5)}...</pre>
      <h1>client env</h1>
      <pre id="client-env"></pre>
    </div>
  `;
	return { html };
}
