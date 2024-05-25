pub fn tsx_quot(value: &str) -> String {
    value.replace('"', "&quot;")
}

pub fn tsx_map<T>(items: Vec<T>, render: &dyn Fn(&T) -> String) -> String {
    items.iter().map(render).collect::<Vec<String>>().join("")
}

pub fn tsx_json<T: serde::Serialize>(value: T) -> String {
    tsx_quot(&serde_json::to_string(&serde_json::json!(value)).expect("failed to stringify json"))
}

pub fn tsx_json_pretty<T: serde::Serialize>(value: T) -> String {
    tsx_quot(&serde_json::to_string_pretty(&serde_json::json!(value)).expect("failed to stringify json"))
}