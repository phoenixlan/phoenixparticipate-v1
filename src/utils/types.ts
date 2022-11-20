import { User, Position, Crew } from '@phoenixlan/phoenix.js';

export type ExpandedPosition = Position.BasePosition & {
    crew?: Crew.BaseCrew;
    team?: Crew.Team;
};

export type BasicUserWithExpandedPositions = User.BasicUser & {
    positions: Array<ExpandedPosition>;
};
