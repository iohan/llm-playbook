ALTER TABLE llm_models
ADD COLUMN model_api_name VARCHAR(128) NOT NULL DEFAULT '' AFTER model_name;
