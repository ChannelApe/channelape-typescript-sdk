import PlayScheduleConfiguration from "./PlayScheduleConfiguration";

export default interface PlayCreateRequest {
  name: string;
  scheduleConfigurations?: PlayScheduleConfiguration[];
}
