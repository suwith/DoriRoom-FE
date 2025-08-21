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
  const { email, profile, setProfile, reset } = useSignupStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // 중복 확인 상태
  const [uidChecking, setUidChecking] = useState(false);
  const [uidOk, setUidOk] = useState(null); // true | false | null
  const [nickChecking, setNickChecking] = useState(false);
  const [nickOk, setNickOk] = useState(null);

  useEffect(() => {
    if (!email) router.replace('/signup/email');
  }, [email, router]);

  // 아이디/닉네임 변경 시 중복 결과 초기화
  useEffect(() => {
    setUidOk(null);
  }, [profile.username]);
  useEffect(() => {
    setNickOk(null);
  }, [profile.nickname]);

  async function onCheckUsername() {
    if (!profile.username.trim()) return;
    setUidChecking(true);
    const res = await checkUsernameAvailable(profile.username.trim());
    setUidOk(res.available);
    setUidChecking(false);
  }

  async function onCheckNickname() {
    if (!profile.nickname.trim()) return;
    setNickChecking(true);
    const res = await checkNicknameAvailable(profile.nickname.trim());
    setNickOk(res.available);
    setNickChecking(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    // 유효성
    const okCore =
      profile.username.trim().length >= 4 &&
      validPassword(profile.password) &&
      profile.password === profile.passwordConfirm &&
      profile.nickname.trim().length >= 2;

    if (!okCore) {
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
      // 다음 화면: 프로필 사진 등록
      router.replace('/signup/profileImage');
    } catch (e2) {
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
      document.documentElement.style.setProperty('--footer-h', `${Math.ceil(h)}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `input,button,select,textarea{scroll-margin-bottom:calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px) + 12px);}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const usernameLenOk = profile.username.trim().length >= 4 && profile.username.trim().length <= 12;
  const nicknameLenOk = profile.nickname.trim().length >= 2 && profile.nickname.trim().length <= 10;
  const passwordOk = validPassword(profile.password);
  const passwordMatch = profile.password && profile.password === profile.passwordConfirm;

  const formValid = usernameLenOk && passwordOk && passwordMatch && nicknameLenOk;

  return (
    <div
      className="min-h-full flex flex-col px-4 pt-28"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar title="회원가입" />

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
              disabled={!usernameLenOk || uidChecking}
              className={`flex-1 px-3 py-3 rounded-[10px] text-background ${
                usernameLenOk ? 'bg-main-100 ' : 'bg-neutral-300 '
              }`}
            >
              {uidChecking ? '확인 중' : '중복 확인'}
            </button>
          </div>

          <p className="mt-2 text-xs text-neutral-600 font-normal">영문 소문자 및 숫자 조합으로 4~12자 설정해 주세요.</p>

          {/* 에러/성공 메시지 */}
          {!usernameLenOk && profile.username ? (
            <div className="mt-2 text-xs text-red-600 space-y-1">
              <p>
                <i className="mgc_warning_fill text-md pb-0.5"/>
                이미 등록되어 있는 아이디예요!
              </p>
              <p>
                <i className="mgc_warning_fill text-md pb-0.5"/>
                4~12자 사이로 설정해 주세요!
              </p>
            </div>
          ) : null}
          {uidOk === false ? (
            <p className="mt-2 text-xs text-red-600">
              <i className="mgc_warning_fill text-md pb-0.5"/>이미 등록되어 있는 아이디예요!</p>
          ) : null}
          {uidOk && usernameLenOk ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5"/>사용 가능한 아이디예요.</p>
          ) : null}
        </div>

        {/* 비밀번호 */}
        <div className="mb-7">
          <PasswordInput
            id="password"
            label="비밀번호를 입력해 주세요."
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={profile.password}
            onChange={(e) => setProfile({ password: e.target.value })}
          />
          <PasswordInput
            id="passwordConfirm"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={profile.passwordConfirm}
            onChange={(e) => setProfile({ passwordConfirm: e.target.value })}
          />
          <p className="mt-2 text-xs text-neutral-600 font-normal flex flex-col">
            <span>영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로</span>
            <span>6~20자 설정해 주세요.</span>
          </p>

          {!passwordOk && profile.password ? (
            <div className="mt-2 text-xs text-red-600 space-y-1 ">
              <p className=" items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5"/>
                영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 설정해 주세요!
              </p>
              <p className=" items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5"/>
                6~20자 사이로 설정해 주세요!
              </p>
            </div>
          ) : null}
          {profile.password && profile.passwordConfirm && !passwordMatch ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5"/>비밀번호가 일치하지 않아요!</p>
          ) : null}
          {passwordOk && passwordMatch ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5"/>확인이 완료되었어요.</p>
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
              disabled={!nicknameLenOk || nickChecking}
              className={`flex-1 px-3 py-3 rounded-[10px] text-background ${
                nicknameLenOk ? 'bg-main-100 ' : 'bg-neutral-300 '
              }`}
            >
              {nickChecking ? '확인 중' : '중복 확인'}
            </button>
          </div>

          <p className="mt-2 text-xs text-neutral-600">2~10자까지 설정이 가능해요.</p>

          {!nicknameLenOk && profile.nickname ? (
            <div className="mt-1 text-xs text-red-600 space-y-1">
              <p className="items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5"/>
                이미 등록되어 있는 닉네임이에요!
              </p>
              <p className="items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5"/>
                2~10자 사이로 설정해 주세요!
              </p>
            </div>
          ) : null}
          {nickOk === false ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5"/>
              이미 등록되어 있는 닉네임이에요!
            </p>
          ) : null}
          {nickOk && nicknameLenOk ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5"/>
              사용 가능한 닉네임이에요.</p>
          ) : null}
        </div>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <div
          aria-hidden
          style={{
            height:
              'calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px))',
          }}
        />
      </form>

      <div
        ref={footerRef}
        className="sticky left-0 right-0 pt-4 pb-7"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))' }}
      >
        <PrimaryButton
          type="button"
          disabled={loading || !formValid}
          onClick={(e) => {
            const formEl = e.currentTarget.closest('div')?.previousElementSibling;
            if (formEl?.tagName === 'FORM') formEl.requestSubmit();
          }}
        >
          {loading ? '처리 중...' : '입력 완료'}
        </PrimaryButton>
      </div>
    </div>
  );
}
