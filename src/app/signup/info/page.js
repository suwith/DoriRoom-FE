// app/signup/info/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSignupStore } from '@/stores/useSignupStore';
import {
  checkNicknameAvailable,
  checkUsernameAvailable,
  submitSignupProfile,
} from '@/hooks/auth/useSignup';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import TextInput from '@/app/auth/_components/TextInput';
import PasswordInput from '@/app/auth/_components/PasswordInput';
import PrimaryButton from '@/app/_components/PrimaryButton';
import LoadingModal from '@/app/_components/LoadingModal';

function validPassword(pw) {
  if (!pw) return false;
  const lenOk = pw.length >= 6 && pw.length <= 20;
  const types = [
    /[a-zA-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^a-zA-Z0-9]/.test(pw),
  ].filter(Boolean).length;
  return lenOk && types >= 2;
}

function extractErrorMessage(err) {
  if (!err) return '';
  if (typeof err === 'string') return err;
  if (typeof err?.message === 'string' && err.message) return err.message;
  if (typeof err?.response?.data?.error === 'string')
    return err.response.data.error;
  if (typeof err?.data?.error === 'string') return err.data.error;
  if (typeof err?.response?.data?.message === 'string')
    return err.response.data.message;
  return '';
}

export default function SignupInfoPage() {
  const router = useRouter();
  const { email, profile, setProfile } = useSignupStore();

  const [submitting, setSubmitting] = useState(false);
  const [globalErr, setGlobalErr] = useState(null);

  // 아이디/닉네임 중복 확인 상태와 에러를 각각 관리
  const [uid, setUid] = useState({
    checking: false,
    ok: null, // true: 사용 가능, false: 중복, null: 미확인
    tried: false, // 중복확인 버튼 누른 적 있는가
    checkedValue: '', // 확인 완료 당시의 값
    err: null, // 아이디 섹션 전용 에러 메시지
  });
  const [nick, setNick] = useState({
    checking: false,
    ok: null,
    tried: false,
    checkedValue: '',
    err: null, // 닉네임 섹션 전용 에러 메시지
  });

  useEffect(() => {
    if (!email) router.replace('/signup/email');
  }, [email, router]);

  // 아이디 조건: 소문자+숫자만, 길이 4~12
  const usernameRaw = profile.username.trim();
  const usernameLenOk = usernameRaw.length >= 4 && usernameRaw.length <= 12;
  const usernameLowerOk = /^[a-z0-9]+$/.test(usernameRaw);
  const usernameFormatOk = usernameLenOk && usernameLowerOk;

  // 닉네임 조건: 길이 2~10, 초성, 공백 금지
  const nicknameRaw = profile.nickname.trim();
  const nicknameLenOk = nicknameRaw.length >= 2 && nicknameRaw.length <= 10;
  const nicknameNoSpaceOk = !/\s/.test(nicknameRaw);
  const nicknameNoChoseongOk = !/[\u3131-\u314E]/.test(nicknameRaw);
  const nicknameFormatOk =
    nicknameLenOk && nicknameNoSpaceOk && nicknameNoChoseongOk;

  // 입력이 바뀌면 이전 중복확인 결과 무효화
  useEffect(() => {
    setUid((s) => ({
      ...s,
      ok: null,
      tried: false,
      err: null,
    }));
  }, [profile.username]);

  useEffect(() => {
    setNick((s) => ({
      ...s,
      ok: null,
      tried: false,
      err: null,
    }));
  }, [profile.nickname]);

  // 아이디 중복확인
  async function onCheckUsername() {
    if (!usernameFormatOk || uid.checking) return;
    setUid((s) => ({ ...s, checking: true, tried: true, err: null }));
    try {
      const res = await checkUsernameAvailable(usernameRaw);
      setUid({
        checking: false,
        tried: true,
        ok: !!res.available, // 성공 규칙상 항상 true
        checkedValue: usernameRaw,
        err: null,
      });
    } catch (e2) {
      setUid({
        checking: false,
        tried: true,
        ok: false,
        checkedValue: '',
        err:
          extractErrorMessage(e2) || '아이디 중복 확인 중 오류가 발생했습니다.',
      });
    }
  }

  async function onCheckNickname() {
    if (nick.checking) return;

    // 길이 조건 안되면 바로 에러
    if (!nicknameLenOk) {
      setNick((s) => ({
        ...s,
        tried: true,
        ok: false,
        err: '닉네임은 2~10자 사이로 입력해 주세요.',
      }));
      return;
    }

    // 길이는 되지만 나머지 조건(공백, 초성) 위반 시
    if (!nicknameFormatOk) {
      let msg = '';
      if (!nicknameNoSpaceOk) msg = '닉네임에는 공백을 사용할 수 없어요.';
      else if (!nicknameNoChoseongOk) msg = '닉네임에 초성을 포함할 수 없어요.';
      setNick((s) => ({
        ...s,
        tried: true,
        ok: false,
        err: msg,
      }));
      return;
    }

    // 유효성 통과 시 API 요청
    setNick((s) => ({ ...s, checking: true, tried: true, err: null }));
    try {
      const res = await checkNicknameAvailable(nicknameRaw);
      setNick({
        checking: false,
        tried: true,
        ok: !!res.available,
        checkedValue: nicknameRaw,
        err: null,
      });
    } catch (e2) {
      setNick({
        checking: false,
        tried: true,
        ok: false,
        checkedValue: '',
        err:
          (typeof e2 === 'string' && e2) ||
          e2?.message ||
          '닉네임 중복 확인 중 오류가 발생했어요.',
      });
    }
  }

  // 비밀번호 검증
  const passwordOk = validPassword(profile.password);
  const passwordMatch =
    profile.password && profile.password === profile.passwordConfirm;

  // 현재 값에 대해 중복확인이 유효한지
  const uidCheckedAndValid =
    uid.ok === true && uid.checkedValue === usernameRaw;
  const nickCheckedAndValid =
    nick.ok === true && nick.checkedValue === nicknameRaw;

  // 제출 버튼 활성화 조건
  const formValid =
    usernameFormatOk &&
    nicknameLenOk &&
    passwordOk &&
    passwordMatch &&
    uidCheckedAndValid &&
    nickCheckedAndValid;

  async function onSubmit(e) {
    e.preventDefault();
    setGlobalErr(null);

    if (!formValid) {
      // 어떤 것이 부족한지 안내
      if (!usernameFormatOk)
        return setGlobalErr('아이디 형식을 확인해 주세요.');
      if (!uidCheckedAndValid)
        return setGlobalErr('아이디 중복 확인을 완료해 주세요.');
      if (!nicknameLenOk) return setGlobalErr('닉네임 형식을 확인해 주세요.');
      if (!nickCheckedAndValid)
        return setGlobalErr('닉네임 중복 확인을 완료해 주세요.');
      if (!passwordOk) return setGlobalErr('비밀번호 조건을 충족해 주세요.');
      if (!passwordMatch) return setGlobalErr('비밀번호가 일치하지 않습니다.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSignupProfile({
        email,
        username: usernameRaw,
        password: profile.password,
        nickname: nicknameRaw,
        avatarFile: profile.avatarFile,
      });
      router.replace('/signup/profileImage');
    } catch (e2) {
      setGlobalErr(extractErrorMessage(e2) || '회원가입에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  // 키보드 안전영역 처리
  const footerRef = useRef(null);
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const setVar = () => {
      const h = el.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty(
        '--footer-h',
        `${Math.ceil(h)}px`
      );
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent =
      'input,button,select,textarea{scroll-margin-bottom:calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px) + 12px);}';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="min-h-full flex flex-col px-4 pt-28"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar
        title="회원가입"
        className="bg-background"
        onBackClick={() => {
          setProfile({
            username: '',
            password: '',
            passwordConfirm: '',
            nickname: '',
            avatarFile: null,
          });
        }}
      />
      <form onSubmit={onSubmit} className="flex-1 flex flex-col">
        {/* 아이디 */}
        <div className="mb-7">
          <div className="flex justify-between items-end gap-2">
            <TextInput
              id="username"
              placeholder="아이디"
              label="아이디를 입력해주세요."
              autoComplete="username"
              value={profile.username}
              onChange={(e) => setProfile({ username: e.target.value })}
              className="mb-0 flex-4"
            />
            <button
              type="button"
              onClick={onCheckUsername}
              disabled={!usernameFormatOk || uid.checking}
              className={`flex-1 px-3 py-3 rounded-[10px] text-background ${
                usernameFormatOk ? 'bg-main-100' : 'bg-neutral-300'
              }`}
            >
              중복 확인
            </button>
          </div>

          {/* 형식 안내 */}
          <p className="mt-3 text-xs text-neutral-600">
            영문 소문자 및 숫자 조합으로 4~12자 설정해 주세요.
          </p>

          {/* 중복확인 결과/에러/필요 안내 */}
          {uid.err ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              {uid.err}
            </p>
          ) : null}

          {uid.tried && uid.ok === false && !uid.err ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              이미 등록되어 있는 아이디예요!
            </p>
          ) : null}

          {uidCheckedAndValid && usernameFormatOk ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5" />
              사용 가능한 아이디예요.
            </p>
          ) : null}
        </div>

        {/* 비밀번호 */}
        <div className="mb-7">
          <PasswordInput
            id="password"
            label="비밀번호를 입력해 주세요."
            placeholder="비밀번호"
            autoComplete="new-password"
            value={profile.password}
            onChange={(e) => setProfile({ password: e.target.value })}
            className="mb-2"
          />
          <PasswordInput
            id="passwordConfirm"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={profile.passwordConfirm}
            onChange={(e) => setProfile({ passwordConfirm: e.target.value })}
          />
          <p className="mt-2 text-xs text-neutral-600 flex flex-col">
            <span>영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로</span>
            <span>6~20자 설정해 주세요.</span>
          </p>
          {!passwordOk && profile.password ? (
            <div className="mt-1 text-xs text-red-600 space-y-1">
              <p className="items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5" />
                영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 설정해
                주세요!
              </p>
              <p className="items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5" />
                6~20자 사이로 설정해 주세요!
              </p>
            </div>
          ) : null}
          {profile.password && profile.passwordConfirm && !passwordMatch ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              비밀번호가 일치하지 않아요!
            </p>
          ) : null}
          {passwordOk && passwordMatch ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5" />
              확인이 완료되었어요.
            </p>
          ) : null}
        </div>

        {/* 닉네임 */}
        <div className="mb-7">
          <div className="flex justify-between items-end gap-2">
            <TextInput
              id="nickname"
              placeholder="닉네임"
              label="닉네임을 입력해 주세요."
              value={profile.nickname}
              onChange={(e) => setProfile({ nickname: e.target.value })}
              className="mb-0 flex-4"
            />
            <button
              type="button"
              onClick={onCheckNickname}
              disabled={!nicknameLenOk || nick.checking} // 길이 조건 안되면 버튼 비활성화
              className={`flex-1 px-3 py-3 rounded-[10px] text-background ${
                nicknameLenOk ? 'bg-main-100' : 'bg-neutral-300'
              }`}
            >
              중복 확인
            </button>
          </div>

          <p className="mt-3 text-xs text-neutral-600">
            2~10자까지 설정이 가능해요.
          </p>

          {nick.err ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              {nick.err}
            </p>
          ) : null}

          {nick.tried && nick.ok === false && !nick.err ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              이미 등록되어 있는 닉네임이에요!
            </p>
          ) : null}

          {nickCheckedAndValid && nicknameLenOk ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5" />
              사용 가능한 닉네임이에요.
            </p>
          ) : null}
        </div>

        {globalErr ? (
          <p className="mt-1 text-sm text-red-600 items-center flex gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            {globalErr}
          </p>
        ) : null}

        <div
          aria-hidden
          style={{
            height:
              'calc(var(--footer-h,30px) + env(safe-area-inset-bottom) + var(--kb-offset,0px))',
          }}
        />
      </form>

      <div
        ref={footerRef}
        className="sticky left-0 right-0 pt-4 pb-7"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <PrimaryButton
          type="button"
          disabled={submitting || !formValid}
          onClick={(e) => {
            const formEl =
              e.currentTarget.closest('div')?.previousElementSibling;
            if (formEl?.tagName === 'FORM') formEl.requestSubmit();
          }}
        >
          {submitting ? '처리 중...' : '입력 완료'}
        </PrimaryButton>
      </div>

      <LoadingModal open={submitting} />
    </div>
  );
}
