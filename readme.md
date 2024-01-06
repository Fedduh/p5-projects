## Run project
- in src/index.ts define which project to load
  - each project is in a folder in /projects
- $ npm run start
- visit http://localhost:8080/

### Example to load project 'barcelona' change index.ts to
```import p5 from 'p5';
import { barcelona } from './projects/barcelona';
 
export const myp5 = new p5(barcelona, document.body);
```