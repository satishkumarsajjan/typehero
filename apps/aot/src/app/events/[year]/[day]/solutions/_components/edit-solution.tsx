import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import { RichMarkdownEditor } from '@repo/ui/components/rich-markdown-editor';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { useToast } from '@repo/ui/components/use-toast';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';
import { updateSolution } from './_actions';
import { useUploadThing } from '~/utils/useUploadthing';
import type { ChallengeSolution } from '../[solutionId]/page';

const formSchema = z.object({
  title: createNoProfanitySchemaWithValidate((zodString) =>
    zodString.min(5, 'The title must be longer than 5 characters'),
  ),
  content: createNoProfanitySchemaWithValidate((zodString) =>
    zodString.min(30, 'Content must be longer than 30 characters'),
  ),
});

export type FormSchema = z.infer<typeof formSchema>;

interface EditSolutionProps {
  solution: ChallengeSolution;
  setIsEditing: (isEditing: boolean) => void;
}

export function EditSolution({ solution, setIsEditing }: EditSolutionProps) {
  const { slug } = useParams();
  const session = useSession();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: solution.title,
      content: solution.description,
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: FormSchema) => {
    try {
      await updateSolution({
        id: solution.id,
        description: data.content ?? '',
        slug: slug as string,
        title: data.title ?? '',
        // TODO: Is this guaranteed to exist, or is userId actually optional?
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        userId: session.data?.user?.id!,
      });

      toast({
        variant: 'success',
        title: 'Your solution has been updated!',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong. Please try again.',
      });
    } finally {
      setIsEditing(false);
    }
  };

  const { theme } = useTheme();
  document.documentElement.setAttribute('data-color-mode', theme ?? 'system');

  return (
    <Form {...form}>
      <form className="relative flex h-full flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-background/90 dark:bg-muted/90 sticky right-0 top-0 flex w-full items-center justify-between gap-2 border-b border-zinc-300 bg-opacity-20 p-1 pr-2 backdrop-blur-sm dark:border-zinc-700">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="rounded-xl border-zinc-300 bg-zinc-100 focus-visible:ring-0 dark:border-zinc-700 dark:bg-zinc-900"
                      {...field}
                      placeholder="Enter a title for your solution."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="h-8 rounded-lg bg-white px-3 py-2 text-black hover:bg-zinc-200 focus-visible:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus-visible:bg-zinc-700"
            onClick={() => setIsEditing(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="h-8 rounded-lg px-3 py-2"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Update
          </Button>
        </div>
        <div className="flex flex-1 flex-col">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <RichMarkdownEditor
                  allowImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  useUploadThing={useUploadThing}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
