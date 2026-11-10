package listener;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * {@code AppConfig} は、アプリケーションの起動時／終了時の処理を定義するリスナークラスです。
 * <p>
 * {@code ServletContextListener} を実装しており、セッションの有効期限（30分）を初期化時に設定します。
 * 【Supported via standard programming aids】
 */
@WebListener
public class AppConfig implements ServletContextListener {
	/**
     * アプリケーション起動時に呼び出され、セッションタイムアウトを30分に設定します。
     *
     * @param sce {@link ServletContextEvent} オブジェクト
     * 【Supported via standard programming aids】
     */
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // set timeout 30 phút (30 x 60 giây)
        sce.getServletContext().setSessionTimeout(30);
    }
    
    /**
     * アプリケーション終了時に呼び出されます（今回は特に処理なし）。
     *
     * @param sce {@link ServletContextEvent} オブジェクト
     * 【Supported via standard programming aids】
     */
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // không cần xử lý gì ở đây
    }
}