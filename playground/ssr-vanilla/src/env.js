// this import is fine
import { VITE_FOO } from 'virtual:env:public';

// this import would throw an error
// import {SUPER_SECRET} from 'virtual:env';

export function setupEnv(element) {
	element.innerHTML = `VITE_FOO = ${VITE_FOO}`;
}
