import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useMembershipInfo } from '../../hooks/api/useMembershipInfo';
import { LoadingSpinner } from '../../sharedComponents/LoadingSpinner';

export const MembershipInfo = () => {
    const { data, isLoading, isLoadingError } = useMembershipInfo();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isLoadingError) {
        return <b>Noe gikk feil med innlasting av medlemskapsinformasjon.</b>;
    }

    return (
        <div>
            <ReactMarkdown>{data ?? ''}</ReactMarkdown>
        </div>
    );
};
