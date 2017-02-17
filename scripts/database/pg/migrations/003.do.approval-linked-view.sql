/* We don t use an enum to avoid having to update it */
CREATE OR REPLACE VIEW cd_v_app_approval AS
(SELECT name, url, callback_url, icon_url, TOS_url, privacy_url, app_id, token, fields, cd_app_approval.created_at
FROM cd_app_approval JOIN cd_app ON cd_app_approval.app_id = cd_app.id);
