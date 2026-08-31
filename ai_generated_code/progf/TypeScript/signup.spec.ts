/**
 * Assignment 2~4
 * @see https://github.com/walking-sunset/selection-task/blob/d8aead05a8be48a40274ec9e275a2b53495407f7/README.md?plain=1#L108-L124
 *
 * original test code Written with routine coding tools-4:
 * @see https://chat.openai.com/share/bcf2f05d-2c46-4920-8c8f-9b5d6a9536ff
 */

/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect, Page } from "@playwright/test"
import { apiUrl, mock_token } from "./mockdata"

const provideMockApi = async (page: Page) => {
  // 회원가입 API는 무조건 성공
  await page.route(`${apiUrl}/auth/signup`, (r) => r.fulfill({ status: 201 }))

  // 로그인 API는 로그인이 성공했을 시 Response Body에 JWT를 포함해서 응답
  await page.route(`${apiUrl}/auth/signin`, (r) =>
    r.fulfill({ status: 200, json: { access_token: mock_token } }),
  )

  // 예시 TODO 목록
  await page.route(`${apiUrl}/todos`, (r) =>
    r.fulfill({
      status: 200,
      json: [
        { id: 1, todo: "치킨", isCompleted: false, userId: 1 },
        { id: 2, todo: "피자", isCompleted: true, userId: 1 },
        { id: 3, todo: "햄버거", isCompleted: false, userId: 1 },
      ],
    }),
  )
}

test("회원가입 및 로그인 플로우", async ({ page }) => {
  /**
   * Assignment 2
   *
   * @see https://github.com/walking-sunset/selection-task/blob/d8aead05a8be48a40274ec9e275a2b53495407f7/README.md?plain=1#L108-L110
   */
  // Test for signup
  await provideMockApi(page)
  await page.goto("/signup")
  await page.fill('input[data-testid="email-input"]', "test@gmail.com")
  await page.fill('input[data-testid="password-input"]', "password123")
  await expect(page.getByTestId("signup-button")).toBeEnabled()
  await page.click('button[data-testid="signup-button"]')

  // Checking redirection to signin page after successful signup
  await expect(page).toHaveURL(/\/signin$/)

  // Test for signin
  await page.fill('input[data-testid="email-input"]', "test@gmail.com")
  await page.fill('input[data-testid="password-input"]', "password123")
  await page.click('button[data-testid="signin-button"]')

  /**
   * Assignment 3
   *
   * @see https://github.com/walking-sunset/selection-task/blob/d8aead05a8be48a40274ec9e275a2b53495407f7/README.md?plain=1#L112-L117
   */
  // Checking redirection to todo page after successful signin
  await expect(page).toHaveURL(/\/todo$/)

  // 응답받은 JWT는 로컬 스토리지에 저장
  const jwt = await page.evaluate(() => localStorage.getItem("jwt-token"))
  expect(jwt).toBe(mock_token)

  /**
   * Assignment 4
   *
   * @see https://github.com/walking-sunset/selection-task/blob/d8aead05a8be48a40274ec9e275a2b53495407f7/README.md?plain=1#L119-L124
   */
  // 로컬 스토리지에 토큰이 있는 상태로 `/signin` 또는 `/signup` 페이지에 접속한다면 `/todo` 경로로 리다이렉트
  await page.goto("/signin")
  await expect(page).toHaveURL(/\/todo$/)

  await page.goto("/signup")
  await expect(page).toHaveURL(/\/todo$/)

  // 로컬 스토리지에 토큰이 없는 상태로 `/todo`페이지에 접속한다면 `/signin` 경로로 리다이렉트
  await page.evaluate(() => localStorage.removeItem("jwt-token"))
  await page.goto("/todo")
  await expect(page).toHaveURL(/\/signin$/)
})
