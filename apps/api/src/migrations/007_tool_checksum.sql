ALTER TABLE tools
ADD COLUMN checksum BINARY(32) NULL,
ADD COLUMN filename VARCHAR(255) NOT NULL UNIQUE,
ADD UNIQUE KEY ux_tools_checksum (checksum);
