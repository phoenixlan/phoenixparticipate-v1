/*
 * @created 31/05/2021 - 20:55
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect, useRef } from 'react';

const useDidMountEffect = (func: () => void, deps: any[]) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
};

export default useDidMountEffect;
