// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn is_desktop() -> bool {
  true
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![is_desktop])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
