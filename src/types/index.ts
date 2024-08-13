export interface Configuration {
  flow: string;
  entities_to_mock: string[];
  is_db_mocked: boolean;
  db_config: {
    username: string;
    password: string;
  };
}
