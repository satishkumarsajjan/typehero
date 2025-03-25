'use client';
import { CodePanel, type CodePanelProps } from '@repo/monaco';
import { EditorShortcutsButton } from '../../challenge/_components/editor-shortcuts/editor-shortcuts-button';
import { FullscreenButton } from '../../../components/fullscreen-button';
import { ResetEditorButton } from '../../challenge/_components/reset-editor-button';
import { SettingsButton } from '../../challenge/_components/settings/settings-button';
import { useChallengePlaygroundStore } from './challenge-playground-store';

export function Wrapper() {
  const { values, updateValues } = useChallengePlaygroundStore();
  const updatePlaygroundTestsLocalStorage = (code: string) => {
    updateValues({ ...values, challenge: { ...values.challenge, tests: code } });
  };
  const updatePlaygroundCodeLocalStorage = (code: string) => {
    updateValues({ ...values, challenge: { ...values.challenge, code } });
  };

  return (
    <CodePanel
      challenge={values.challenge}
      // TODO: Why is saveSubmission required if it's not always provided?
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      saveSubmission={(() => {}) as unknown as CodePanelProps['saveSubmission']}
      submissionDisabled={false}
      settingsElement={<SettingsElements />}
      updatePlaygroundTestsLocalStorage={updatePlaygroundTestsLocalStorage}
      updatePlaygroundCodeLocalStorage={updatePlaygroundCodeLocalStorage}
    />
  );
}

function SettingsElements() {
  return (
    <>
      <ResetEditorButton />
      <EditorShortcutsButton />
      <SettingsButton />
      <FullscreenButton />
    </>
  );
}
