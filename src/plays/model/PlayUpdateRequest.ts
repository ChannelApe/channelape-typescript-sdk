import Play from "./Play";

export default interface PlayUpdateRequest extends Partial<Play> {
  createdAt?: Date;
  updatedAt?: Date;
}
