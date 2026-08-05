export type CharacteristicFieldType =
  | "text"
  | "select"
  | "chips"
  | "number"
  | "toggle";

export type CharacteristicOption = {
  id: string;
  label: string;
  /** When selected, show a free-text input for a custom value. */
  isOther?: boolean;
};

export type CharacteristicFieldDef = {
  id: string;
  /** RU label for now; structure allows KG/EN later. */
  label: string;
  type: CharacteristicFieldType;
  placeholder?: string;
  options?: readonly CharacteristicOption[];
  unit?: string;
  required?: boolean;
  group: "primary" | "additional";
  /** Multi-select chips (default false = single). */
  multiple?: boolean;
  maxLength?: number;
};
