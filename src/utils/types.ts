import { User, Position, PositionMapping, Crew } from '@phoenixlan/phoenix.js';

export type ExpandedPosition = Position.BasePosition & {
    crew?: Crew.BaseCrew;
    team?: Crew.Team;
};

export type ExpandedPositionMapping = PositionMapping.BasePositionMapping & {
    position: ExpandedPosition;
    user_uuid: string;
    event_uuid: string;
};

export type BasicUserWithExpandedPositionMappings = User.BasicUser & {
    position_mappings: Array<ExpandedPositionMapping>;
};
