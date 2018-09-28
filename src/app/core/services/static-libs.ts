export function join
    <B extends{[k in BK]: string[]}, J, BK extends keyof B, P extends string>
    (toJoin: B[], joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
   : (B & { [ projectTo in P ]: J[] })[];

export function join
   <B extends{[k in BK]: string[]}, J, BK extends keyof B, P extends string>
   (toJoin: B, joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
  : (B & { [ projectTo in P ]: J[] });

export function join
  <B extends{[k in BK]: string}, J, BK extends keyof B, P extends string>
  (toJoin: B[], joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
 : (B & { [ projectTo in P ]: J })[];

export function join
  <B extends{[k in BK]: string}, J, BK extends keyof B, P extends string>
  (toJoin: B, joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
 : (B & { [ projectTo in P ]: J });

export function join(toJoin, joinMap, baseKey, projectTo) {
    const itemsToMatch = Array.isArray(toJoin) ? toJoin : [toJoin];
    const res = [];
    const joinToArray = Array.isArray(itemsToMatch[0][baseKey]);
    for(const toMatch of itemsToMatch) {
        let joined;
        if(joinToArray) {
            joined = toMatch[baseKey].map(key => joinMap[key])
        } else {
            joined = joinMap[toMatch[baseKey]]; 
        }
        res.push({ ...toMatch, [projectTo]: joined });
    }
    if(Array.isArray(toJoin)) {
        return res;
    } else {
        return res[0];
    }
}

