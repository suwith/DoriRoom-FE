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

//비밀번호 조건
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

export default function SignupInfoPage() {
  const router = useRouter();
  const { email, profile, setProfile } = useSignupStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // 중복 확인 상태 묶어서 관리
  const [uid, setUid] = useState({
    checking: false,
    ok: null,
    tried: false,
    checkedValue: '',
  });
  const [nick, setNick] = useState({
    checking: false,
    ok: null,
    tried: false,
    checkedValue: '',
  });

  useEffect(() => {
    if (!email) router.replace('/signup/email');
  }, [email, router]);

  // 입력이 바뀌면 이전 중복 확인 결과 무효화
  useEffect(() => {
    setUid((s) => ({ ...s, ok: null, tried: false }));
  }, [profile.username]);
  useEffect(() => {
    setNick((s) => ({ ...s, ok: null, tried: false }));
  }, [profile.nickname]);

  // 아이디 조건
  const usernameLenOk =
    profile.username.trim().length >= 4 && profile.username.trim().length <= 12;

  // 영문 소문자 + 숫자만 허용
  const usernameLowerOk = /^[a-z0-9]+$/.test(profile.username.trim());

  // 최종 아이디 버튼 활성화 조건
  const canCheckUid = usernameLenOk && usernameLowerOk;

  const nicknameLenOk =
    profile.nickname.trim().length >= 2 && profile.nickname.trim().length <= 10;

  //아이디 중복확인
  async function onCheckUsername() {
    if (!usernameLenOk) return;
    setUid((s) => ({ ...s, checking: true, tried: true }));
    const res = await checkUsernameAvailable(profile.username.trim());
    setUid({
      checking: false,
      tried: true,
      ok: !!res.available,
      checkedValue: profile.username.trim(),
    });
  }

  //닉네임 중복확인
  async function onCheckNickname() {
    if (!nicknameLenOk) return;
    setNick((s) => ({ ...s, checking: true, tried: true }));
    const res = await checkNicknameAvailable(profile.nickname.trim());
    setNick({
      checking: false,
      tried: true,
      ok: !!res.available,
      checkedValue: profile.nickname.trim(),
    });
  }

  const passwordOk = validPassword(profile.password);
  const passwordMatch =
    profile.password && profile.password === profile.passwordConfirm;

  // 버튼 활성화 조건: 형식 + 비번 유효 + 비번일치 + 아이디/닉네임 중복 확인 통과
  const formValid =
    usernameLenOk &&
    nicknameLenOk &&
    passwordOk &&
    passwordMatch &&
    uid.ok === true &&
    uid.checkedValue === profile.username.trim() &&
    nick.ok === true &&
    nick.checkedValue === profile.nickname.trim();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!formValid) {
      setErr('입력값을 확인해주세요.');
      return;
    }
    setLoading(true);
    try {
      await submitSignupProfile({
        email,
        username: profile.username.trim(),
        password: profile.password,
        nickname: profile.nickname.trim(),
        avatarFile: profile.avatarFile,
      });
      router.replace('/signup/profileImage');
    } catch (_) {
      setErr('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

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
      <HeaderNavigationBar title="회원가입" className="bg-background" />
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
              disabled={!canCheckUid || uid.checking}
              className={`flex-1 px-3 py-3 rounded-[10px] text-background ${
                canCheckUid ? 'bg-main-100' : 'bg-neutral-300'
              }`}
            >
              {uid.checking ? '확인 중' : '중복 확인'}
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            영문 소문자 및 숫자 조합으로 4~12자 설정해 주세요.
          </p>

          {uid.tried && uid.ok === false ? (
            <p className="mt-2 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              이미 등록되어 있는 아이디예요!
            </p>
          ) : null}
          {uid.tried && uid.ok === true && usernameLenOk ? (
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
            <div className="mt-2 text-xs text-red-600 space-y-1">
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
              disabled={!nicknameLenOk || nick.checking}
              className={`flex-1 px-3 py-3 rounded-[10px] text-background ${
                nicknameLenOk ? 'bg-main-100' : 'bg-neutral-300'
              }`}
            >
              {nick.checking ? '확인 중' : '중복 확인'}
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            2~10자까지 설정이 가능해요.
          </p>

          {nick.tried && nick.ok === false ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              이미 등록되어 있는 닉네임이에요!
            </p>
          ) : null}
          {nick.tried && nick.ok === true && nicknameLenOk ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5" />
              사용 가능한 닉네임이에요.
            </p>
          ) : null}
        </div>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

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
          disabled={loading || !formValid}
          onClick={(e) => {
            const formEl =
              e.currentTarget.closest('div')?.previousElementSibling;
            if (formEl?.tagName === 'FORM') formEl.requestSubmit();
          }}
        >
          {loading ? '처리 중...' : '입력 완료'}
        </PrimaryButton>
      </div>
    </div>
  );
}
