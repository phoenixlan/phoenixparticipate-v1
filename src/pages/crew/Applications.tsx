/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { BadgeCheck } from '@styled-icons/boxicons-solid/BadgeCheck';
import { CircleWithCross } from '@styled-icons/entypo/CircleWithCross';
import { PatchQuestionFill } from '@styled-icons/bootstrap/PatchQuestionFill';
import { Crew } from '@phoenixlan/phoenix.js';
import { TransitEnterexit } from '@styled-icons/material/TransitEnterexit';

const Box = styled.div`
    overflow: auto;
    max-height: 200px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0.5rem;
    table-layout: fixed;
`;

const Thead = styled.thead`
    & tr th {
        position: sticky;
        top: 0;
    }
`;

const Td = styled.td`
    text-align: center;
    padding: 0.5rem 0.25rem;
`;

const Th = styled.th`
    padding: 0.5rem 0.25rem;
    /*border-bottom: 1px solid ${({ theme }) => theme.colors.DarkGray}; not working */
    background-color: ${({ theme }) => theme.colors.White};
`;

const CheckMark = styled(BadgeCheck)`
    height: 1rem;
    fill: ${({ theme }) => theme.colors.positive};
    margin-right: ${({ theme }) => theme.spacing.xs};
`;

const Mark = styled(CircleWithCross)`
    height: 1rem;
    fill: ${({ theme }) => theme.colors.negative};
    margin-right: ${({ theme }) => theme.spacing.xs};
`;

const QuestionMark = styled(PatchQuestionFill)`
    height: 1rem;
    fill: ${({ theme }) => theme.colors.secondary};
    margin-right: ${({ theme }) => theme.spacing.xs};
`;

const ApplicationView = styled.div`
    padding: ${({ theme }) => theme.spacing.s};
    position: relative;
`;

const ExitIcon = styled(TransitEnterexit)`
    position: absolute;
    top: ${({ theme }) => theme.spacing.xxs};
    right: ${({ theme }) => theme.spacing.xxs};
    cursor: pointer;
`;

const ApplicationVewCrew = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.s};
    word-break: break-word;
`;

const ApplicationVewContent = styled.div`
    word-break: break-word;
`;

const Span = styled.span`
    font-family: monospace;
`;

const BodyRow = styled.tr`
    &:hover {
        background-color: ${({ theme }) => theme.colors.LightGray};
        cursor: pointer;
    }
`;

interface Props {
    applications: Array<Crew.Applications.Application>;
}

export const Applications: React.FC<Props> = ({ applications }) => {
    const [selectedApplication, setSelectedApplication] = useState<Crew.Applications.Application | null>(null);

    const hideSelectedApplicationView = () => {
        setSelectedApplication(null);
    };

    const getState = (status: string) => {
        let statusComponent = (
            <>
                <QuestionMark /> Processing
            </>
        );
        if (status === 'ApplicationState.accepted') {
            statusComponent = (
                <>
                    <CheckMark /> Godtatt
                </>
            );
        } else if (status === 'ApplicationState.rejected') {
            statusComponent = (
                <>
                    <Mark /> Avslått
                </>
            );
        }
        return statusComponent;
    };
    return (
        <Box>
            {selectedApplication ? (
                <ApplicationView>
                    <ExitIcon size="1.5rem" onClick={hideSelectedApplicationView} />
                    <ApplicationVewCrew>
                        <strong>Crew: </strong>
                        { selectedApplication.crew.name }
                    </ApplicationVewCrew>
                    <ApplicationVewContent>
                        <strong>Søknadstekst: </strong>
                        {selectedApplication.contents}
                    </ApplicationVewContent>
                </ApplicationView>
            ) : (
                <Table>
                    <Thead>
                        <tr>
                            <Th>
                                <span>Crew</span>
                            </Th>
                            <Th>
                                <span>Dato</span>
                            </Th>
                            <Th>
                                <span>Status</span>
                            </Th>
                        </tr>
                    </Thead>
                    <tbody>
                        {applications.length === 0 && (
                            <tr>
                                <Td colSpan={3}>
                                    <strong>No applications found</strong>
                                </Td>
                            </tr>
                        )}
                        {applications.map((application) => (
                            <BodyRow key={application.uuid} onClick={() => setSelectedApplication(application)}>
                                <Td>{application.crew.name}</Td>
                                <Td>
                                    {new Date(application.created * 1000).toLocaleDateString('no-NB', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                    })}
                                </Td>
                                <Td>
                                    <Span>{getState(application.state)}</Span>
                                </Td>
                            </BodyRow>
                        ))}
                    </tbody>
                </Table>
            )}
        </Box>
    );
};
