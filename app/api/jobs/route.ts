import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { experienceSummary, desiredCareer, city } = await req.json();

    if (!desiredCareer) {
      return NextResponse.json({ error: 'desiredCareer required' }, { status: 400 });
    }

    const jobs = [
      {
        id: 'job-1',
        title: `${desiredCareer} - Entry Level`,
        company: 'Tech Startup Inc.',
        type: 'Entry-Level',
        location: city || 'Remote',
        indeedLink: `https://www.indeed.com/jobs?q=${encodeURIComponent('entry level ' + desiredCareer)}`,
        linkedinLink: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(desiredCareer)}&f_E=1`,
      },
      {
        id: 'job-2',
        title: `Junior ${desiredCareer}`,
        company: 'Growing Company',
        type: 'Junior',
        location: city || 'Remote',
        indeedLink: `https://www.indeed.com/jobs?q=${encodeURIComponent('junior ' + desiredCareer)}`,
        linkedinLink: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent('junior ' + desiredCareer)}&f_E=1`,
      },
      {
        id: 'job-3',
        title: `${desiredCareer} Internship`,
        company: 'Fortune 500 Company',
        type: 'Internship',
        location: city || 'Remote',
        indeedLink: `https://www.indeed.com/jobs?q=${encodeURIComponent(desiredCareer + ' internship')}`,
        linkedinLink: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(desiredCareer)}&f_E=1`,
      },
      {
        id: 'job-4',
        title: `${desiredCareer} Analyst`,
        company: 'Consulting Firm',
        type: 'Entry-Level',
        location: city || 'Remote',
        indeedLink: `https://www.indeed.com/jobs?q=${encodeURIComponent(desiredCareer + ' analyst')}`,
        linkedinLink: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(desiredCareer)}&f_E=1`,
      },
    ];

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const career = searchParams.get('career');

  if (!career) {
    return NextResponse.json({ error: 'career query parameter required' }, { status: 400 });
  }

  return NextResponse.json({
    career,
    indeedLink: `https://www.indeed.com/jobs?q=${encodeURIComponent(career)}`,
    linkedinLink: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(career)}`,
  });
}
