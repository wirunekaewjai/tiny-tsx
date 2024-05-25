pub fn tsx_quot(value: &str) -> String {
    value.replace('"', "&quot;")
}

pub fn tsx_map<T>(items: Vec<T>, render: &dyn Fn(&T) -> String) -> String {
    items.iter().map(render).collect::<Vec<String>>().join("")
}

pub fn tsx_json(value: serde_json::Value) -> String {
    tsx_quot(&serde_json::to_string(&value).expect("failed to stringify json"))
}

pub fn tsx_json_pretty(value: serde_json::Value) -> String {
    tsx_quot(&serde_json::to_string_pretty(&value).expect("failed to stringify json"))
}