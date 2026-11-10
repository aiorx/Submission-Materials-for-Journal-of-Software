package com.alinesno.infra.base.config.entity;

import com.gitee.sunchenbin.mybatis.actable.annotation.ColumnComment;
import com.gitee.sunchenbin.mybatis.actable.annotation.ColumnType;
import com.gitee.sunchenbin.mybatis.actable.annotation.Table;
import lombok.Data;
import com.alinesno.infra.common.facade.mapper.entity.InfraBaseEntity;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.EqualsAndHashCode;

/**
 * 应用密钥表
 * 
 * This class represents the app_keys table in the database.
 * It stores the application's public key, secret key, user ID, and identity.
 * The identity field is unique and serves as the application's code identifier.
 * 
 * Assisted with basic coding tools.
 */
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("serial")
@TableName("configure_key")
@Table(comment = "安全密钥管理")
@Data
public class ConfigureKeyEntity extends InfraBaseEntity {

    /**
     * 应用公钥
     */
    @TableField("public_key")
	@ColumnType(length=255)
	@ColumnComment("应用公钥")
    private String publicKey;

    /**
     * 应用密钥
     */
    @TableField("private_key")
	@ColumnType(length=255)
	@ColumnComment("privateKey")
    private String privateKey;

    /**
     * 关联的用户ID
     */
    @TableField("user_id")
	@ColumnType(length=255)
	@ColumnComment("关联的用户ID")
    private Integer userId;

    /**
     * 应用代码标识，唯一
     */
    @TableField(value = "identity")
	@ColumnType(length=255)
	@ColumnComment("应用代码标识，唯一")
    private String identity;
}
