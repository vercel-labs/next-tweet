export interface Card {
  name: string
  url: string
  binding_values: BindingValues
}

export interface BindingValues {
  choice1_label: StringValue
  choice1_count: StringValue
  choice2_label: StringValue
  choice2_count: StringValue
  choice3_label?: StringValue
  choice3_count?: StringValue
  choice4_label?: StringValue
  choice4_count?: StringValue
  end_datetime_utc: StringValue
  counts_are_final: BooleanValue
  last_updated_datetime_utc: StringValue
  duration_minutes: StringValue
}

export interface StringValue {
  string_value: string
  type: string
}

export interface BooleanValue {
  boolean_value: boolean
  type: string
}

export type PollChoice = {
  label: string
  count: number
  percentage: string
}
